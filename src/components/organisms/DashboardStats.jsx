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
    },
    diveTypeComparison: {
      openWater: 0,
      pool: 0
    },
    disciplineStats: {
      openWater: {
        CWT: 0,
        CWTB: 0,
        CNF: 0,
        FIM: 0
      },
      pool: {
        DYN: 0,
        DYNB: 0,
        DNF: 0,
        STA: 0
      }
    },
    mostRecordedDiscipline: {
      name: '',
      count: 0,
      type: ''
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

// Calculate progress data and chart statistics
      const chartData = calculateChartData(sessions, allDives);

setStats({
        totalSessions: sessions.length,
        totalDives: allDives.length,
        maxDepth,
        maxDistance,
        maxTime,
        recentSessions,
        ...chartData
      });
    } catch (err) {
      setError("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

const calculateChartData = (sessions, dives) => {
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
      DNF: [],
      STA: []
    };

    // Calculate discipline stats
    const disciplineStats = {
      openWater: { CWT: 0, CWTB: 0, CNF: 0, FIM: 0 },
      pool: { DYN: 0, DYNB: 0, DNF: 0, STA: 0 }
    };

    let diveTypeComparison = { openWater: 0, pool: 0 };
    let mostRecordedDiscipline = { name: '', count: 0, type: '' };

    Object.values(sessionDiveMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach(session => {
        const { date, discipline, dives: sessionDives } = session;
        
        if (!disciplineProgress[discipline]) return;

        // Count dives per discipline
        const diveCount = sessionDives.length;
        
        if (['CWT', 'CWTB', 'CNF', 'FIM'].includes(discipline)) {
          disciplineStats.openWater[discipline] += diveCount;
          diveTypeComparison.openWater += diveCount;
        } else if (['DYN', 'DYNB', 'DNF', 'STA'].includes(discipline)) {
          disciplineStats.pool[discipline] += diveCount;
          diveTypeComparison.pool += diveCount;
        }

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

    // Find most recorded discipline
    const allDisciplineCounts = {
      ...disciplineStats.openWater,
      ...disciplineStats.pool
    };

    for (const [discipline, count] of Object.entries(allDisciplineCounts)) {
      if (count > mostRecordedDiscipline.count) {
        mostRecordedDiscipline = {
          name: discipline,
          count,
          type: ['CWT', 'CWTB', 'CNF', 'FIM'].includes(discipline) ? 'Open Water' : 'Pool'
        };
      }
    }

    return {
      progressData: disciplineProgress,
      diveTypeComparison,
      disciplineStats,
      mostRecordedDiscipline
    };
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

const renderPieChart = () => {
    const { openWater, pool } = stats.diveTypeComparison;
    const total = openWater + pool;
    
    if (total === 0) {
      return (
        <Card className="p-6">
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
            Dive Type Distribution
          </h3>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>No dives recorded yet</p>
            </div>
          </div>
        </Card>
      );
    }

    const chartData = {
      series: [openWater, pool],
      options: {
        chart: {
          type: 'pie',
          height: 300
        },
        labels: ['Open Water Freediving', 'Confined Water (Pool) Freediving'],
        colors: ['#0ea5e9', '#8b5cf6'],
        legend: {
          position: 'bottom',
          fontSize: '12px'
        },
        tooltip: {
          y: {
            formatter: function(value) {
              const percentage = ((value / total) * 100).toFixed(1);
              return `${value} dives (${percentage}%)`;
            }
          }
        },
        responsive: [{
          breakpoint: 768,
          options: {
            chart: {
              height: 250
            },
            legend: {
              fontSize: '10px'
            }
          }
        }]
      }
    };

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
          Dive Type Distribution
        </h3>
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          height={300}
        />
      </Card>
    );
  };

  const renderOpenWaterBarChart = () => {
    const disciplines = stats.disciplineStats.openWater;
    const data = Object.entries(disciplines).map(([key, value]) => ({ discipline: key, count: value }));
    const colors = ['#0ea5e9', '#06b6d4', '#0284c7', '#0369a1'];

    const chartData = {
      series: [{
        name: 'Total Dives',
        data: data.map(item => item.count)
      }],
      options: {
        chart: {
          type: 'bar',
          height: 300,
          toolbar: { show: false }
        },
        colors: colors,
        xaxis: {
          categories: data.map(item => item.discipline),
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
            }
          }
        },
        title: {
          text: 'Total Dives by Open Water Discipline',
          style: {
            fontSize: '14px',
            color: '#374151'
          }
        },
        grid: {
          borderColor: '#f1f5f9'
        },
        tooltip: {
          y: {
            formatter: function(value) {
              return value + ' dives';
            }
          }
        }
      }
    };

    return (
      <Card className="p-6">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={300}
        />
      </Card>
    );
  };

  const renderPoolBarChart = () => {
    const disciplines = stats.disciplineStats.pool;
    const data = Object.entries(disciplines).map(([key, value]) => ({ discipline: key, count: value }));
    const colors = ['#8b5cf6', '#a855f7', '#9333ea', '#10b981'];

    const chartData = {
      series: [{
        name: 'Total Dives',
        data: data.map(item => item.count)
      }],
      options: {
        chart: {
          type: 'bar',
          height: 300,
          toolbar: { show: false }
        },
        colors: colors,
        xaxis: {
          categories: data.map(item => item.discipline),
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
            }
          }
        },
        title: {
          text: 'Total Dives by Pool Discipline',
          style: {
            fontSize: '14px',
            color: '#374151'
          }
        },
        grid: {
          borderColor: '#f1f5f9'
        },
        tooltip: {
          y: {
            formatter: function(value) {
              return value + ' dives';
            }
          }
        }
      }
    };

    return (
      <Card className="p-6">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={300}
        />
      </Card>
    );
  };

  const renderDistanceHorizontalChart = () => {
    const distanceDisciplines = { DYN: 0, DYNB: 0, DNF: 0 };
    
    // Calculate total distances for each discipline
    Object.values(stats.progressData).forEach((progressArray, index) => {
      const disciplineKey = Object.keys(stats.progressData)[index];
      if (['DYN', 'DYNB', 'DNF'].includes(disciplineKey)) {
        distanceDisciplines[disciplineKey] = stats.disciplineStats.pool[disciplineKey] || 0;
      }
    });

    const data = Object.entries(distanceDisciplines).map(([key, value]) => ({ discipline: key, count: value }));
    const colors = ['#8b5cf6', '#a855f7', '#9333ea'];

    if (data.every(item => item.count === 0)) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📏</div>
            <p>No distance disciplines recorded yet</p>
          </div>
        </div>
      );
    }

    const chartData = {
      series: [{
        name: 'Total Dives',
        data: data.map(item => item.count)
      }],
      options: {
        chart: {
          type: 'bar',
          height: 250,
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '60%'
          }
        },
        colors: colors,
        xaxis: {
          labels: {
            style: {
              colors: '#64748b',
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          categories: data.map(item => item.discipline),
          labels: {
            style: {
              colors: '#64748b',
              fontSize: '12px'
            }
          }
        },
        grid: {
          borderColor: '#f1f5f9'
        },
        tooltip: {
          y: {
            formatter: function(value) {
              return value + ' dives';
            }
          }
        }
      }
    };

    return (
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={250}
      />
    );
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
          y: config.metric === 'depth' ? -Math.abs(item.value) : item.value, // Negative depth values for open water
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
              const displayValue = config.metric === 'depth' ? Math.abs(value) : value;
              return displayValue + config.unit;
            }
          }
        },
        tooltip: {
          custom: function({ series, seriesIndex, dataPointIndex, w }) {
            const data = w.config.series[seriesIndex].data[dataPointIndex];
            const date = new Date(data.x).toLocaleDateString();
            const displayValue = config.metric === 'depth' ? Math.abs(data.y) : data.y;
            const value = displayValue + config.unit;
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
          {stats.progressData.STA && stats.progressData.STA.length > 0 && 
            renderDisciplineChart('STA', stats.progressData.STA)}
        </div>
</div>

      {/* New Comprehensive Charts Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold font-display text-gray-900 mb-2">Dive Analytics</h2>
          <p className="text-gray-600">Comprehensive analysis of your freediving performance</p>
        </div>

        {/* Most Recorded Discipline */}
        {stats.mostRecordedDiscipline.name && (
          <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold font-display text-gray-900 mb-2">
                  Most Recorded Discipline
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary-600">
                    {stats.mostRecordedDiscipline.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    ({stats.mostRecordedDiscipline.type})
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.mostRecordedDiscipline.count} recorded dives
                </p>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
          </Card>
        )}

        {/* Dive Type Comparison Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderPieChart()}
          
          {/* Open Water Disciplines Bar Chart */}
          {renderOpenWaterBarChart()}
        </div>

        {/* Pool Disciplines Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderPoolBarChart()}
          
          {/* Distance Disciplines Horizontal Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
              Distance Disciplines Comparison
            </h3>
            {renderDistanceHorizontalChart()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;