import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { BackButton } from "../components/BackButton"
import { Checkbox } from "../components/Checkbox"
import colors from "tailwindcss/colors"
import { api } from "../lib/axios"

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
]

export function New() {
  const [weekDays, setWeekDays] = useState<number[]>([])
  const [title, setTitle] = useState("")

  function handleToggleWeekDays(weekDaysIndex: number) {
    //Checa se o índice da checkbox clicada já existe no array weekDays, se sim, ele filtra e remove do array
    if (weekDays.includes(weekDaysIndex)) {
      setWeekDays((prevState) =>
        prevState.filter((weekDay) => weekDay !== weekDaysIndex)
      )
    } else {
      //Adiciona o novo indice no array de índices
      setWeekDays((prevState) => [...prevState, weekDaysIndex])
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim() || weekDays.length === 0) {
        Alert.alert(
          "Novo Hábito",
          "Informe o título do novo hábito e informe a periodicidade."
        )
      }

      await api.post("habits", {
        title,
        weekDays,
      })

      setTitle("")
      setWeekDays([])

      Alert.alert("Novo Hábito", "Hábito criado com sucesso!")
    } catch (error) {
      console.log(error)
      Alert.alert("Ops!", "Não foi possível criar um novo hábito")
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-white font-extrabold text-3xl">
          Criar Hábito
        </Text>

        <Text className="mt-6 text-white font-semibold text-base">
          Qual o seu comprometimento?
        </Text>

        <TextInput
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
          placeholder="Exercícios, dormir bem, etc..."
          placeholderTextColor={colors.zinc[400]}
          onChangeText={setTitle}
          value={title}
        />

        <Text className="font-semibold mt-4 mb-3 text-white text-base">
          Qual é a recorrência?
        </Text>

        {availableWeekDays.map((weekDay, index) => {
          return (
            <Checkbox
              key={`${weekDay}-${index}`}
              title={weekDay}
              checked={weekDays.includes(index)} // Retorna true ou false caso o indice esteja ou não no array
              onPress={() => handleToggleWeekDays(index)}
            />
          )
        })}

        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
          onPress={handleCreateNewHabit}
        >
          <Feather name="check" size={20} color={colors.white} />

          <Text className="font-semibold text-base text-white ml-2">
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
