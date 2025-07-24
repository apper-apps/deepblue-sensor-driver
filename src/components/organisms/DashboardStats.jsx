import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import MetricCard from "@/components/molecules/MetricCard";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { SessionService } from "@/services/api/sessionService";
import { DiveService } from "@/services/api/diveService";
const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalDives: 0,
    maxDepth: 0,
    maxDistance: 0,
    maxTime: 0,
    recentSessions: [],
    progressData: {
      depth: [],
      distance: [],
      time: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      
      const sessions = await SessionService.getAll();
      const allDives = await DiveService.getAll();
      
      // Calculate max values by discipline type
      const openWaterDives = allDives.filter(dive => dive.depth !== null);
      const poolDistanceDives = allDives.filter(dive => dive.distance !== null);
      const staticDives = allDives.filter(dive => dive.time !== null);
      
      const maxDepth = openWaterDives.length > 0 
        ? Math.max(...openWaterDives.map(d => d.depth))
        : 0;
        
      const maxDistance = poolDistanceDives.length > 0
        ? Math.max(...poolDistanceDives.map(d => d.distance))
        : 0;
        
      const maxTime = staticDives.length > 0
        ? Math.max(...staticDives.map(d => d.time))
        : 0;

      // Get recent sessions (last 5)
      const recentSessions = sessions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      // Calculate progress data for charts
      const progressData = calculateProgressData(sessions, allDives);

      setStats({
        totalSessions: sessions.length,
        totalDives: allDives.length,
        maxDepth,
        maxDistance,
        maxTime,
        recentSessions,
        progressData
      });
    } catch (err) {
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

const calculateProgressData = (sessions, dives) => {
    // Group dives by session date for chronological progress
    const sessionDiveMap = {};
    sessions.forEach(session => {
      sessionDiveMap[session.Id] = {
        date: session.date,
        discipline: session.discipline,
        dives: dives.filter(dive => dive.sessionId === session.Id)
      };
    });

    // Initialize discipline-specific progress arrays
    const disciplineProgress = {
      CWT: [],
      CWTB: [],
      CNF: [],
      FIM: [],
      DYN: [],
      DYNB: [],
      DNF: []
    };

    Object.values(sessionDiveMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach(session => {
        const { date, discipline, dives: sessionDives } = session;
        
        if (!disciplineProgress[discipline]) return;

        let bestValue = null;
        let metric = '';

        // Determine the metric and best value based on discipline
        if (['CWT', 'CWTB', 'CNF', 'FIM'].includes(discipline)) {
          // Depth disciplines
          const depthDives = sessionDives.filter(dive => dive.depth !== null);
          if (depthDives.length > 0) {
            bestValue = Math.max(...depthDives.map(d => d.depth));
            metric = 'depth';
          }
        } else if (['DYN', 'DYNB', 'DNF'].includes(discipline)) {
          // Distance disciplines
          const distanceDives = sessionDives.filter(dive => dive.distance !== null);
          if (distanceDives.length > 0) {
            bestValue = Math.max(...distanceDives.map(d => d.distance));
            metric = 'distance';
          }
        } else if (discipline === 'STA') {
          // Time discipline
          const timeDives = sessionDives.filter(dive => dive.time !== null);
          if (timeDives.length > 0) {
            bestValue = Math.max(...timeDives.map(d => d.time));
            metric = 'time';
          }
        }

        if (bestValue !== null) {
          disciplineProgress[discipline].push({
            date,
            value: bestValue,
            metric,
            discipline
          });
        }
      });

    return disciplineProgress;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStats} />;

const getDisciplineConfig = (discipline) => {
    const configs = {
      CWT: {
        title: 'Constant Weight (CWT)',
        color: '#0ea5e9',
        unit: 'm',
        metric: 'Depth'
      },
      CWTB: {
        title: 'Constant Weight Bifins (CWTB)',
        color: '#06b6d4',
        unit: 'm',
        metric: 'Depth'
      },
      CNF: {
        title: 'Constant No Fins (CNF)',
        color: '#0284c7',
        unit: 'm',
        metric: 'Depth'
      },
      FIM: {
        title: 'Free Immersion (FIM)',
        color: '#0369a1',
        unit: 'm',
        metric: 'Depth'
      },
      DYN: {
        title: 'Dynamic Apnea (DYN)',
        color: '#8b5cf6',
        unit: 'm',
        metric: 'Distance'
      },
      DYNB: {
        title: 'Dynamic Bifins (DYNB)',
        color: '#a855f7',
        unit: 'm',
        metric: 'Distance'
      },
      DNF: {
        title: 'Dynamic No Fins (DNF)',
        color: '#9333ea',
        unit: 'm',
        metric: 'Distance'
      }
    };
    return configs[discipline] || configs.CWT;
  };

  const renderDisciplineChart = (discipline, data) => {
    const config = getDisciplineConfig(discipline);
    
    if (data.length === 0) {
      return (
        <Card className="p-6">
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">{config.title}</h3>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>No {discipline} sessions yet</p>
              <p className="text-sm">Complete some {discipline} sessions to see your progress</p>
            </div>
          </div>
        </Card>
      );
    }

    const chartData = {
      series: [{
        name: `${config.metric} (${config.unit})`,
        data: data.map(item => ({
          x: new Date(item.date).getTime(),
          y: item.value,
          discipline: item.discipline
        }))
      }],
      options: {
        chart: {
          type: 'line',
          height: 300,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        colors: [config.color],
        stroke: {
          curve: 'smooth',
          width: 3
        },
        markers: {
          size: 6,
          colors: [config.color],
          strokeColors: '#fff',
          strokeWidth: 2,
          hover: {
            size: 8
          }
        },
        grid: {
          borderColor: '#f1f5f9',
          strokeDashArray: 3
        },
        xaxis: {
          type: 'datetime',
          labels: {
            style: {
              colors: '#64748b',
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: '#64748b',
              fontSize: '12px'
            },
            formatter: function(value) {
              return value + config.unit;
            }
          }
        },
        tooltip: {
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            const date = new Date(data.x).toLocaleDateString();
            const value = data.y + config.unit;
            return `
              <div class="bg-white p-3 rounded-lg shadow-lg border">
                <div class="font-semibold text-gray-900">${date}</div>
                <div style="color: ${config.color}">${config.metric}: ${value}</div>
                <div class="text-sm text-gray-600">${config.title}</div>
              </div>
            `;
          }
        },
        responsive: [{
          breakpoint: 768,
          options: {
            chart: {
              height: 250
            },
            markers: {
              size: 4
            }
          }
        }]
      }
    };

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">{config.title}</h3>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={300}
        />
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Existing Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Sessions"
          value={stats.totalSessions}
          icon="Calendar"
          className="bg-primary-50 border-primary-200"
        />
        
        <MetricCard
          title="Total Dives"
          value={stats.totalDives}
          icon="Target"
          className="bg-blue-50 border-blue-200"
        />
        
        <MetricCard
          title="Max Depth"
          value={stats.maxDepth}
          unit="m"
          icon="ArrowDown"
          gradient={true}
        />
        
        <MetricCard
          title="Max Distance"
          value={stats.maxDistance}
          unit="m"
          icon="ArrowRight"
          className="bg-purple-50 border-purple-200"
        />
        
        <MetricCard
          title="Best Static Time"
          value={stats.maxTime > 0 ? formatTime(stats.maxTime) : "0:00"}
          icon="Clock"
          className="bg-green-50 border-green-200"
        />
        
        <MetricCard
          title="Recent Activity"
          value={stats.recentSessions.length}
          unit="sessions"
          icon="Activity"
          className="bg-orange-50 border-orange-200"
        />
      </div>

{/* Discipline-Specific Progress Charts */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold font-display text-gray-900 mb-2">Discipline Progress Charts</h2>
          <p className="text-gray-600">Track your improvement in each freediving discipline</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {renderDisciplineChart('CWT', stats.progressData.CWT)}
          {renderDisciplineChart('CWTB', stats.progressData.CWTB)}
          {renderDisciplineChart('CNF', stats.progressData.CNF)}
          {renderDisciplineChart('FIM', stats.progressData.FIM)}
          {renderDisciplineChart('DYN', stats.progressData.DYN)}
          {renderDisciplineChart('DYNB', stats.progressData.DYNB)}
          {renderDisciplineChart('DNF', stats.progressData.DNF)}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;