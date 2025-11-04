"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Trophy, Volume2 } from "lucide-react"
import { getChartTracks, type DeezerTrack } from "@/lib/deezer"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Player } from "@/components/player"

interface QuizQuestion {
  track: DeezerTrack
  options: string[]
  correctAnswer: string
  type: "track" | "artist"
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const TOTAL_QUESTIONS = 10

  useEffect(() => {
    loadQuestions()
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5
    }
  }, [])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const tracks = await getChartTracks()

      // Shuffle and take first 10 tracks
      const shuffled = [...tracks].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS)

      const quizQuestions: QuizQuestion[] = shuffled.map((track, index) => {
        const type = index % 2 === 0 ? "track" : "artist"
        const correctAnswer = type === "track" ? track.title : track.artist.name

        // Get wrong options from other tracks
        const wrongOptions = tracks
          .filter((t) => t.id !== track.id)
          .map((t) => (type === "track" ? t.title : t.artist.name))
          .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)

        const options = [...wrongOptions, correctAnswer].sort(() => Math.random() - 0.5)

        return {
          track,
          options,
          correctAnswer,
          type,
        }
      })

      setQuestions(quizQuestions)
      setLoading(false)
    } catch (error) {
      console.error("Failed to load quiz questions:", error)
      setLoading(false)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return // Already answered

    setSelectedAnswer(answer)
    setShowResult(true)

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    // Auto advance after 2 seconds
    setTimeout(() => {
      if (currentQuestion < TOTAL_QUESTIONS - 1) {
        nextQuestion()
      } else {
        setGameOver(true)
        if (audioRef.current) {
          audioRef.current.pause()
          setIsPlaying(false)
        }
      }
    }, 2000)
  }

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1)
    setSelectedAnswer(null)
    setShowResult(false)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.load()
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setGameOver(false)
    setIsPlaying(false)
    loadQuestions()
  }

  const question = questions[currentQuestion]

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-32 lg:pb-24">
        <div className="flex items-center justify-center min-h-full p-4">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando quiz...</p>
            </div>
          ) : gameOver ? (
            <Card className="max-w-md w-full p-8 text-center space-y-6">
              <Trophy className="h-16 w-16 text-primary mx-auto" />
              <div>
                <h2 className="text-3xl font-bold mb-2">Quiz Finalizado!</h2>
                <p className="text-muted-foreground">Veja como você se saiu</p>
              </div>

              <div className="space-y-2">
                <div className="text-5xl font-bold text-primary">
                  {score}/{TOTAL_QUESTIONS}
                </div>
                <Progress value={(score / TOTAL_QUESTIONS) * 100} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {(score / TOTAL_QUESTIONS) * 100 >= 80 && "Excelente! Você é um expert em música!"}
                  {(score / TOTAL_QUESTIONS) * 100 >= 60 &&
                    (score / TOTAL_QUESTIONS) * 100 < 80 &&
                    "Muito bom! Continue praticando!"}
                  {(score / TOTAL_QUESTIONS) * 100 >= 40 &&
                    (score / TOTAL_QUESTIONS) * 100 < 60 &&
                    "Bom trabalho! Você conhece suas músicas!"}
                  {(score / TOTAL_QUESTIONS) * 100 < 40 && "Continue tentando! A prática leva à perfeição!"}
                </p>
              </div>

              <Button onClick={restartQuiz} size="lg" className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Jogar Novamente
              </Button>
            </Card>
          ) : question ? (
            <Card className="max-w-2xl w-full p-6 space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Questão {currentQuestion + 1} de {TOTAL_QUESTIONS}
                  </span>
                  <span>Pontuação: {score}</span>
                </div>
                <Progress value={(currentQuestion / TOTAL_QUESTIONS) * 100} className="h-2" />
              </div>

              {/* Album Cover and Audio Player */}
              <div className="space-y-4">
                <div className="relative aspect-square max-w-xs mx-auto rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={question.track.album.cover_xl || "/placeholder.svg"}
                    alt="Album cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button size="lg" variant="secondary" className="h-16 w-16 rounded-full" onClick={togglePlay}>
                      {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Volume2 className="h-4 w-4" />
                  <span>Ouça o preview e adivinhe</span>
                </div>

                <audio
                  ref={audioRef}
                  src={question.track.preview}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>

              {/* Question */}
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  {question.type === "track" ? "Qual é o nome desta música?" : "Quem é o artista desta música?"}
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {question.options.map((option, index) => {
                  const isCorrect = option === question.correctAnswer
                  const isSelected = option === selectedAnswer
                  const showCorrect = showResult && isCorrect
                  const showWrong = showResult && isSelected && !isCorrect

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="lg"
                      className={cn(
                        "h-auto py-4 text-lg font-medium transition-all",
                        showCorrect && "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400",
                        showWrong && "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400",
                        !showResult && "hover:bg-accent hover:scale-[1.02]",
                      )}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                    >
                      {option}
                    </Button>
                  )
                })}
              </div>

              {/* Result Message */}
              {showResult && (
                <div
                  className={cn(
                    "text-center p-4 rounded-lg font-medium",
                    selectedAnswer === question.correctAnswer
                      ? "bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-red-500/20 text-red-700 dark:text-red-400",
                  )}
                >
                  {selectedAnswer === question.correctAnswer ? (
                    <span>Correto! 🎉</span>
                  ) : (
                    <span>Errado! A resposta correta é: {question.correctAnswer}</span>
                  )}
                </div>
              )}
            </Card>
          ) : null}
        </div>
      </main>

      <MobileNav />
      <Player />
    </div>
  )
}
