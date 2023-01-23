import { View, Text, ScrollView, Alert } from "react-native"
import { useEffect, useState } from "react"
import { useRoute } from "@react-navigation/native"
import dayjs from "dayjs"
import clsx from "clsx"

import { BackButton } from "../components/BackButton"
import { ProgressBar } from "../components/ProgressBar"
import { Checkbox } from "../components/Checkbox"
import { Loading } from "../components/Loading"
import { EmptyHabit } from "../components/EmptyHabit"

import { api } from "../lib/axios"
import { generateProgressPercentage } from "../util/generate-progress-percentage"

interface Params {
  date: string
}

interface dayInfoProps {
  completedhabits: string[]
  possibleHabits: {
    id: string
    title: string
  }[]
}

export function Habit() {
  const [loading, setLoading] = useState(true)
  const [dayInfo, setDayInfo] = useState<dayInfoProps | null>(null)
  const [completedHabits, setCompletedHabits] = useState<string[]>([])

  const route = useRoute()

  const { date } = route.params as Params

  const parsedDate = dayjs(date)
  const isDateOnPast = parsedDate.endOf("day").isBefore(new Date())
  const dayOfWeek = parsedDate.format("dddd")
  const dayAndMonth = parsedDate.format("DD/MM")

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length)
    : 0

  async function fetchHabits() {
    try {
      setLoading(true)

      const response = await api.get("day", {
        params: {
          date,
        },
      })
      setDayInfo(response.data)
      setCompletedHabits(response.data.completedHabits)
    } catch (error) {
      console.log(error)
      Alert.alert("Ops", "Não foi possível buscar carregar as informações dos habitos!")
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleHabits(habitId: string) {
    try {
      await api.patch(`habits/${habitId}/toggle`)

      if (completedHabits.includes(habitId)) {
        setCompletedHabits((prevState) => prevState.filter((id) => id !== habitId))
      } else {
        setCompletedHabits((prevState) => [...prevState, habitId])
      }
    } catch (error) {
      Alert.alert("Ops", "Não foi possível atualizar o status do hábito!")
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  if (loading) {
    return <Loading />
  }
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">{dayOfWeek}</Text>

        <Text className="text-white font-extrabold text-3xl">{dayAndMonth}</Text>

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isDateOnPast,
          })}
        >
          {dayInfo?.possibleHabits.length ? (
            dayInfo?.possibleHabits.map((habit) => {
              return (
                <Checkbox
                  key={habit.id}
                  title={habit.title}
                  disabled={isDateOnPast}
                  checked={completedHabits.includes(habit.id)}
                  onPress={() => handleToggleHabits(habit.id)}
                />
              )
            })
          ) : (
            <EmptyHabit />
          )}
        </View>

        {isDateOnPast && (
          <Text className="text-white mt-10 text-center">
            Você não pode editar hábitos de datas passadas.
          </Text>
        )}
      </ScrollView>
    </View>
  )
}
