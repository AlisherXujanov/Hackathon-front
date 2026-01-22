'use client'

import { useState, useMemo } from 'react'
import Card from '../../components/Card'
import ScrollAnimation from '../../components/ScrollAnimation'
import Select from '../../components/Select'
import Button from '../../components/Button'
import StatsCard from '../../components/analytics/StatsCard'
import LineChart from '../../components/analytics/LineChart'
import BarChart from '../../components/analytics/BarChart'
import PieChart from '../../components/analytics/PieChart'
import ActivityHeatmap from '../../components/analytics/ActivityHeatmap'
import ProgressComparison from '../../components/analytics/ProgressComparison'
import { getAnalyticsData, exportAnalyticsData } from '../../store/analytics/analyticsData'
import { HiClock, HiBookOpen, HiCheckCircle, HiFire, HiDownload, HiChartBar, HiTrendingUp } from 'react-icons/hi'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('month')
  const [activeTab, setActiveTab] = useState('overview')

  const analyticsData = useMemo(() => getAnalyticsData(period), [period])

  const handleExport = (format) => {
    const data = exportAnalyticsData(format)
    if (!data) return

    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics_${period}_${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'overview', label: 'Обзор' },
    { id: 'skills', label: 'Навыки' },
    { id: 'activity', label: 'Активность' },
    { id: 'comparison', label: 'Сравнение' },
  ]

  return (
    <main className="relative w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-[35%] -left-28 h-72 w-72 rounded-full bg-purple-200/22 blur-3xl" />
      </div>

      <div className="container-wrapper pt-24 sm:pt-28 pb-10">
        <ScrollAnimation>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 text-slate-900">Аналитика</h1>
              <p className="text-slate-600">Детальная статистика вашего обучения и прогресса</p>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                options={[
                  { value: 'week', label: 'Неделя' },
                  { value: 'month', label: 'Месяц' },
                  { value: 'year', label: 'Год' },
                ]}
                className="w-auto"
              />
              <Button variant="outline" size="sm" onClick={() => handleExport('json')} leftIcon={<HiDownload />}>
                JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('csv')} leftIcon={<HiDownload />}>
                CSV
              </Button>
            </div>
          </div>
        </ScrollAnimation>

        {/* Tabs */}
        <ScrollAnimation delay={100}>
          <Card variant="glass" className="p-2 mb-6">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </Card>
        </ScrollAnimation>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ScrollAnimation delay={150}>
            <StatsCard
              label="Всего часов"
              value={`${analyticsData.totalStats.totalHours}ч`}
              icon={HiClock}
              color="primary"
              trend="up"
              trendValue="12.5"
            />
          </ScrollAnimation>
          <ScrollAnimation delay={200}>
            <StatsCard
              label="Уроков завершено"
              value={analyticsData.totalStats.totalLessons}
              icon={HiBookOpen}
              color="success"
              trend="up"
              trendValue="8.3"
            />
          </ScrollAnimation>
          <ScrollAnimation delay={250}>
            <StatsCard
              label="Задач выполнено"
              value={analyticsData.totalStats.totalTasks}
              icon={HiCheckCircle}
              color="accent"
              trend="up"
              trendValue="15.2"
            />
          </ScrollAnimation>
          <ScrollAnimation delay={300}>
            <StatsCard
              label="Серия дней"
              value={`${analyticsData.totalStats.currentStreak} дней`}
              icon={HiFire}
              color="warning"
            />
          </ScrollAnimation>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScrollAnimation delay={350}>
                <Card variant="glass" className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">Прогресс обучения</h3>
                    <HiTrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <LineChart
                    data={analyticsData.dailyActivity}
                    dataKey="hours"
                    name="Часы обучения"
                    color="#3B82F6"
                    height={300}
                  />
                </Card>
              </ScrollAnimation>

              <ScrollAnimation delay={400}>
                <Card variant="glass" className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">Распределение по категориям</h3>
                    <HiChartBar className="w-6 h-6 text-purple-600" />
                  </div>
                  <PieChart data={analyticsData.categoryDistribution} height={300} />
                </Card>
              </ScrollAnimation>
            </div>

            <ScrollAnimation delay={450}>
              <Card variant="glass" className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6">Календарь активности</h3>
                <ActivityHeatmap data={analyticsData.activityHeatmap} />
              </Card>
            </ScrollAnimation>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScrollAnimation delay={500}>
                <Card variant="glass" className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6">Уроки по дням</h3>
                  <LineChart
                    data={analyticsData.dailyActivity}
                    dataKey="lessons"
                    name="Уроки"
                    color="#10B981"
                    height={250}
                  />
                </Card>
              </ScrollAnimation>

              <ScrollAnimation delay={550}>
                <Card variant="glass" className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6">Задачи по дням</h3>
                  <LineChart
                    data={analyticsData.dailyActivity}
                    dataKey="tasks"
                    name="Задачи"
                    color="#F59E0B"
                    height={250}
                  />
                </Card>
              </ScrollAnimation>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <ScrollAnimation delay={350}>
              <Card variant="glass" className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6">Прогресс по навыкам</h3>
                <BarChart
                  data={analyticsData.skillsProgress}
                  dataKey="level"
                  name="Уровень (%)"
                  color="#3B82F6"
                  height={350}
                />
              </Card>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.skillsProgress.map((skill, index) => (
                <ScrollAnimation key={skill.name} delay={400 + index * 50}>
                  <Card variant="glass" className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-extrabold text-slate-900">{skill.name}</h4>
                      <div className="text-sm font-semibold text-slate-600">{skill.level}%</div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${skill.level}%`, backgroundColor: skill.color }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>{skill.hours}ч</span>
                      <span>{skill.lessons} уроков</span>
                    </div>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <ScrollAnimation delay={350}>
              <Card variant="glass" className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6">Календарь активности</h3>
                <ActivityHeatmap data={analyticsData.activityHeatmap} />
              </Card>
            </ScrollAnimation>

            <ScrollAnimation delay={400}>
              <Card variant="glass" className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6">Активность по времени суток</h3>
                <BarChart
                  data={analyticsData.timeDistribution}
                  dataKey="value"
                  name="Активность"
                  color="#8B5CF6"
                  height={300}
                />
              </Card>
            </ScrollAnimation>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScrollAnimation delay={450}>
                <Card variant="glass" className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6">Ежедневная активность</h3>
                  <LineChart
                    data={analyticsData.dailyActivity}
                    dataKey="hours"
                    name="Часы"
                    color="#3B82F6"
                    height={300}
                  />
                </Card>
              </ScrollAnimation>

              <ScrollAnimation delay={500}>
                <Card variant="glass" className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6">Серия дней обучения</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Текущая серия</span>
                      <span className="text-2xl font-extrabold text-slate-900">
                        {analyticsData.learningStreak.current} дней
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Самая длинная</span>
                      <span className="text-2xl font-extrabold text-slate-900">
                        {analyticsData.learningStreak.longest} дней
                      </span>
                    </div>
                    <div className="mt-6 flex gap-1">
                      {analyticsData.learningStreak.data.slice(-30).map((day, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 h-8 rounded ${
                            day.active ? 'bg-green-500' : 'bg-slate-200'
                          }`}
                          title={`${day.date}: ${day.active ? 'Активен' : 'Неактивен'}`}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              </ScrollAnimation>
            </div>
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <ScrollAnimation delay={350}>
              <Card variant="glass" className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6">Сравнение по неделям</h3>
                <ProgressComparison
                  currentData={analyticsData.weeklyComparison}
                  previousData={analyticsData.weeklyComparison.slice(0, -1).map((w, i) => ({
                    ...w,
                    hours: w.hours * 0.85, // Симуляция предыдущих данных
                  }))}
                  height={350}
                />
              </Card>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.weeklyComparison.map((week, index) => (
                <ScrollAnimation key={week.week} delay={400 + index * 50}>
                  <Card variant="glass" className="p-5">
                    <div className="text-sm font-semibold text-slate-600 mb-2">{week.week}</div>
                    <div className="text-2xl font-extrabold text-slate-900 mb-1">{week.hours}ч</div>
                    <div className="text-xs text-slate-600 mb-3">
                      {week.lessons} уроков • {week.tasks} задач
                    </div>
                    {week.improvement !== 0 && (
                      <div
                        className={`text-sm font-semibold ${
                          week.improvement > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {week.improvement > 0 ? '↑' : '↓'} {Math.abs(week.improvement)}%
                      </div>
                    )}
                  </Card>
                </ScrollAnimation>
              ))}
            </div>

            <ScrollAnimation delay={600}>
              <Card variant="glass" className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-6">Статистика по курсам</h3>
                <div className="space-y-4">
                  {analyticsData.courseStats.map((course, index) => (
                    <div key={index} className="border border-app-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-extrabold text-slate-900">{course.name}</h4>
                        <span className="text-sm font-semibold text-slate-600">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <span>{course.lessons} из {course.total} уроков</span>
                        <span>{course.hours} часов</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </ScrollAnimation>
          </div>
        )}
      </div>
    </main>
  )
}
