import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { DiveService } from "@/services/api/diveService";
import { SessionService } from "@/services/api/sessionService";
import ApperIcon from "@/components/ApperIcon";
import Dashboard from "@/components/pages/Dashboard";
import Card from "@/components/atoms/Card";
import MetricCard from "@/components/molecules/MetricCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
const DashboardStats = () => {
const [stats, setStats] = useState({
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
STA: 0
      }
    },
    mostRecordedDiscipline: {
      name: '',
      count: 0,
      type: ''
    },
    favoriteDiveBuddy: {
    favoriteDiveBuddy: {
      name: '',
      count: 0
    },
    favoriteDiveSite: {
      name: '',
      count: 0
    },
    moodStats: {
      very_pleasant: 0,
      pleasant: 0,
      slightly_pleasant: 0,
      neutral: 0,
      slightly_unpleasant: 0,
      unpleasant: 0,
      very_unpleasant: 0
    },
    topMood: {
      mood: '',
      count: 0,
      percentage: 0
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
      
      // Calculate mood statistics
      const moodStats = calculateMoodStats(sessions);

setStats({
        totalDives: allDives.length,
        maxDepth,
        maxDistance,
        maxTime,
        recentSessions,
        ...chartData,
        ...moodStats
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
    
    // Calculate favorite dive buddy and dive site
    const buddyCount = {};
    const siteCount = {};
    
    sessions.forEach(session => {
      if (session.buddyName && session.buddyName.trim() !== '') {
        const buddy = session.buddyName.trim();
        buddyCount[buddy] = (buddyCount[buddy] || 0) + 1;
      }
      if (session.location && session.location.trim() !== '') {
        const site = session.location.trim();
        siteCount[site] = (siteCount[site] || 0) + 1;
      }
    });
    
    let favoriteDiveBuddy = { name: '', count: 0 };
    let favoriteDiveSite = { name: '', count: 0 };
    
    for (const [buddy, count] of Object.entries(buddyCount)) {
      if (count > favoriteDiveBuddy.count) {
        favoriteDiveBuddy = { name: buddy, count };
      }
    }
    
    for (const [site, count] of Object.entries(siteCount)) {
      if (count > favoriteDiveSite.count) {
        favoriteDiveSite = { name: site, count };
      }
    }

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
      mostRecordedDiscipline,
      favoriteDiveBuddy,
      favoriteDiveSite
    };
};

  const calculateMoodStats = (sessions) => {
    const moodStats = {
      very_pleasant: 0,
      pleasant: 0,
      slightly_pleasant: 0,
      neutral: 0,
      slightly_unpleasant: 0,
      unpleasant: 0,
      very_unpleasant: 0
    };

    let totalWithMood = 0;
    sessions.forEach(session => {
      if (session.moodLog && moodStats.hasOwnProperty(session.moodLog)) {
        moodStats[session.moodLog]++;
        totalWithMood++;
      }
    });

    let topMood = { mood: '', count: 0, percentage: 0 };
    for (const [mood, count] of Object.entries(moodStats)) {
      if (count > topMood.count) {
        topMood = {
          mood,
          count,
          percentage: totalWithMood > 0 ? Math.round((count / totalWithMood) * 100) : 0
        };
      }
    }

    return { moodStats, topMood };
  };

  const getMoodIcon = (mood) => {
    const moodIcons = {
      very_pleasant: '😊',
      pleasant: '😌',
      slightly_pleasant: '🙂',
      neutral: '😐',
      slightly_unpleasant: '😕',
      unpleasant: '😞',
      very_unpleasant: '😢'
    };
    return moodIcons[mood] || '😐';
  };

  const getMoodLabel = (mood) => {
    const labels = {
      very_pleasant: 'Very Pleasant',
      pleasant: 'Pleasant',
      slightly_pleasant: 'Slightly Pleasant',
      neutral: 'Neutral',
      slightly_unpleasant: 'Slightly Unpleasant',
      unpleasant: 'Unpleasant',
      very_unpleasant: 'Very Unpleasant'
    };
    return labels[mood] || 'No Data';
  };

  const renderMoodPieChart = () => {
    const moodData = Object.entries(stats.moodStats).filter(([_, count]) => count > 0);
    
    if (moodData.length === 0) {
      return (
        <Card className="p-6">
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
            Dive Moods Recorded
          </h3>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">😐</div>
              <p>No mood data recorded yet</p>
            </div>
          </div>
        </Card>
      );
    }

    const total = moodData.reduce((sum, [_, count]) => sum + count, 0);
    const chartData = {
      series: moodData.map(([_, count]) => count),
      options: {
        chart: {
          type: 'pie',
          height: 300
        },
        labels: moodData.map(([mood, _]) => getMoodLabel(mood)),
        colors: ['#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#ef4444', '#dc2626'],
        legend: {
          position: 'bottom',
          fontSize: '12px'
        },
        tooltip: {
          y: {
            formatter: function(value) {
              const percentage = ((value / total) * 100).toFixed(1);
              return `${value} sessions (${percentage}%)`;
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
          Dive Moods Recorded
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

const renderDisciplineChart = (discipline, data, chartType = 'line') => {
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

    const isHorizontal = ['DYN', 'DYNB', 'DNF'].includes(discipline);
    const actualChartType = chartType === 'line' ? 'line' : 'bar';

    const chartData = {
      series: [{
        name: `${config.metric} (${config.unit})`,
        data: actualChartType === 'line' 
          ? data.map(item => ({
              x: new Date(item.date).getTime(),
              y: config.metric === 'depth' ? -Math.abs(item.value) : item.value,
              discipline: item.discipline
            }))
          : data.map(item => item.value)
      }],
      options: {
        chart: {
          type: actualChartType,
          height: 300,
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        ...(actualChartType === 'bar' && {
          plotOptions: {
            bar: {
              horizontal: isHorizontal,
              barHeight: isHorizontal ? '60%' : undefined
            }
          }
        }),
        colors: [config.color],
        ...(actualChartType === 'line' && {
          stroke: {
            curve: 'smooth',
            width: 3
          },
          markers: {
            size: 6,
            colors: [config.color],
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: { size: 8 }
          }
        }),
        grid: {
          borderColor: '#f1f5f9',
          strokeDashArray: 3
        },
        xaxis: actualChartType === 'line' 
          ? {
              type: 'datetime',
              labels: {
                style: {
                  colors: '#64748b',
                  fontSize: '12px'
                }
              }
            }
          : {
              categories: data.map((_, index) => `Session ${index + 1}`),
              labels: {
                style: {
                  colors: '#64748b',
                  fontSize: '12px'
                }
              }
            },
        yaxis: isHorizontal && actualChartType === 'bar'
          ? {
              categories: data.map((_, index) => `Session ${index + 1}`),
              labels: {
                style: {
                  colors: '#64748b',
                  fontSize: '12px'
                }
              }
            }
          : {
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
        tooltip: actualChartType === 'line'
          ? {
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
            }
          : {
              y: {
                formatter: function(value) {
                  return value + config.unit;
                }
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
          type={actualChartType}
          height={300}
        />
      </Card>
    );
  };

return (
    <div className="space-y-8">
      {/* Reorganized Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Total Dives */}
        <MetricCard
          title="Total Dives"
          value={stats.totalDives}
          icon="Target"
          className="bg-blue-50 border-blue-200"
        />
        
        {/* 2. Most Recorded Discipline */}
        {stats.mostRecordedDiscipline.name && (
          <MetricCard
            title="Most Recorded Discipline"
            value={stats.mostRecordedDiscipline.name}
            subtitle={`${stats.mostRecordedDiscipline.count} dives (${stats.mostRecordedDiscipline.type})`}
            icon="Trophy"
            className="bg-primary-50 border-primary-200"
          />
        )}
        
        {/* 3. Max Depth */}
        <MetricCard
          title="Max Depth"
          value={stats.maxDepth}
          unit="m"
          icon="ArrowDown"
          gradient={true}
        />
        
        {/* 4. Max Distance */}
        <MetricCard
          title="Max Distance"
          value={stats.maxDistance}
          unit="m"
          icon="ArrowRight"
          className="bg-purple-50 border-purple-200"
        />
        
        {/* 5. Best Static Time */}
        <MetricCard
          title="Best Static Time"
          value={stats.maxTime > 0 ? formatTime(stats.maxTime) : "0:00"}
          icon="Clock"
          className="bg-green-50 border-green-200"
        />
        
        {/* 6. My Favorite Dive Buddy */}
        {stats.favoriteDiveBuddy.name && (
          <MetricCard
            title="My Favorite Dive Buddy"
            value={stats.favoriteDiveBuddy.name}
            subtitle={`${stats.favoriteDiveBuddy.count} sessions together`}
            icon="Users"
            className="bg-yellow-50 border-yellow-200"
          />
        )}
        
        {/* 7. Most Favorite Dive Site */}
        {stats.favoriteDiveSite.name && (
          <MetricCard
            title="Most Favorite Dive Site"
value={stats.favoriteDiveSite.name}
            subtitle={`${stats.favoriteDiveSite.count} sessions recorded`}
            icon="MapPin"
            className="bg-cyan-50 border-cyan-200"
          />
        )}
        
        {/* My Top Dive State Of Mind */}
        {stats.topMood.mood && (
          <MetricCard
            title="My Top Dive State Of Mind"
            value={`${getMoodIcon(stats.topMood.mood)} ${getMoodLabel(stats.topMood.mood)}`}
            subtitle={`${stats.topMood.count} sessions (${stats.topMood.percentage}%)`}
            icon="Heart"
            className="bg-pink-50 border-pink-200"
          />
        )}
        
        {/* 9. Recent Activity */}
        <MetricCard
          title="Recent Activity"
          value={stats.recentSessions.length}
          unit="sessions"
          icon="Activity"
          className="bg-orange-50 border-orange-200"
        />
      </div>

      {/* 9. Dive Analytics */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold font-display text-gray-900 mb-2">Dive Analytics</h2>
          <p className="text-gray-600">Comprehensive analysis of your freediving performance</p>
        </div>

        {/* Dive Type Distribution */}
{/* Dive Type Distribution and Mood Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderPieChart()}
          {renderMoodPieChart()}
        </div>
        
        {/* Goals Dashboard - Visual Board */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold font-display text-gray-900 mb-4">
            Goals Dashboard - Visual Board
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <ApperIcon name="Target" size={20} className="text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-900">Depth Goals</h4>
              </div>
              <p className="text-sm text-blue-700 mb-2">Target: 50m CWT</p>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: `${Math.min((stats.maxDepth / 50) * 100, 100)}%`}}></div>
              </div>
              <p className="text-xs text-blue-600 mt-1">Current: {stats.maxDepth}m ({Math.round((stats.maxDepth / 50) * 100)}%)</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-2">
                <ApperIcon name="ArrowRight" size={20} className="text-purple-600 mr-2" />
                <h4 className="font-semibold text-purple-900">Distance Goals</h4>
              </div>
              <p className="text-sm text-purple-700 mb-2">Target: 200m DYN</p>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{width: `${Math.min((stats.maxDistance / 200) * 100, 100)}%`}}></div>
              </div>
              <p className="text-xs text-purple-600 mt-1">Current: {stats.maxDistance}m ({Math.round((stats.maxDistance / 200) * 100)}%)</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <ApperIcon name="Clock" size={20} className="text-green-600 mr-2" />
                <h4 className="font-semibold text-green-900">Time Goals</h4>
              </div>
              <p className="text-sm text-green-700 mb-2">Target: 5:00 STA</p>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: `${Math.min((stats.maxTime / 300) * 100, 100)}%`}}></div>
              </div>
              <p className="text-xs text-green-600 mt-1">Current: {formatTime(stats.maxTime)} ({Math.round((stats.maxTime / 300) * 100)}%)</p>
            </div>
          </div>
        </Card>
{/* Open Water and Pool Bar Charts */}
        <div className="grid grid-cols-1 gap-6">
          {renderOpenWaterBarChart()}
          {renderPoolBarChart()}
        </div>
      </div>

      {/* Discipline Progress Charts */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold font-display text-gray-900 mb-2">Discipline Progress Charts</h2>
          <p className="text-gray-600">Track your improvement in each freediving discipline</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* CWT in vertical bar chart */}
          {renderDisciplineChart('CWT', stats.progressData.CWT, 'bar')}
          {/* CWTB in vertical bar chart */}
          {renderDisciplineChart('CWTB', stats.progressData.CWTB, 'bar')}
          {/* CNF in vertical bar chart */}
          {renderDisciplineChart('CNF', stats.progressData.CNF, 'bar')}
          {/* Free Immersion in vertical bar chart */}
          {renderDisciplineChart('FIM', stats.progressData.FIM, 'bar')}
          {/* DYN in horizontal bar chart */}
          {renderDisciplineChart('DYN', stats.progressData.DYN, 'bar')}
          {/* DYNB in horizontal bar chart */}
          {renderDisciplineChart('DYNB', stats.progressData.DYNB, 'bar')}
          {/* DNF in horizontal bar chart */}
          {renderDisciplineChart('DNF', stats.progressData.DNF, 'bar')}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;