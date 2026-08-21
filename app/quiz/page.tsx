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
    if (audioRef.current) audioRef.current.volume = 0.5
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

    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()

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
      if (currentQuestion < TOTAL_QUESTIONS - 1) nextQuestion()
      else {
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

      <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
        <div className="flex items-center justify-center min-h-full p-3 sm:p-4">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3"></div>
              <p className="text-sm text-muted-foreground">Carregando quiz...</p>
            </div>
          ) : gameOver ? (
            <Card className="max-w-md w-full p-5 sm:p-6 text-center space-y-4 sm:space-y-5">
              <Trophy className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h2 className="text-2xl font-bold mb-1">Quiz Finalizado!</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Veja como você se saiu</p>
              </div>

              <div className="space-y-2">
                <div className="text-4xl sm:text-5xl font-bold text-primary">
                  {score}/{TOTAL_QUESTIONS}
                </div>
                <Progress value={(score / TOTAL_QUESTIONS) * 100} className="h-2.5" />
                <p className="text-xs sm:text-sm text-muted-foreground">
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
            <Card className="max-w-lg w-full p-4 sm:p-5 space-y-3 sm:space-y-4">
              {/* Header */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-muted-foreground">
                  <span>
                    Questão {currentQuestion + 1} de {TOTAL_QUESTIONS}
                  </span>
                  <span>Pontuação: {score}</span>
                </div>
                <Progress value={(currentQuestion / TOTAL_QUESTIONS) * 100} className="h-1.5" />
              </div>

              {/* Album Cover and Audio Player */}
              <div className="flex flex-col items-center space-y-2">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-xl overflow-hidden shadow-md group">
                  <img
                    src={question.track.album.cover_xl || "/placeholder.svg"}
                    alt="Album cover"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-full shadow-lg transition-transform active:scale-95"
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pausar preview" : "Tocar preview"}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Volume2 className="h-3.5 w-3.5" />
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
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  {question.type === "track" ? "Qual é o nome desta música?" : "Quem é o artista desta música?"}
                </h2>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {question.options.map((option, index) => {
                  const isCorrect = option === question.correctAnswer
                  const isSelected = option === selectedAnswer
                  const showCorrect = showResult && isCorrect
                  const showWrong = showResult && isSelected && !isCorrect

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={cn(
                        "h-auto min-h-11 sm:min-h-12 py-2 px-3 text-xs sm:text-sm font-medium whitespace-normal text-center leading-snug transition-all rounded-lg",
                        showCorrect && "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400 font-semibold",
                        showWrong && "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400 font-semibold",
                        !showResult && "hover:bg-accent hover:border-primary/50 hover:scale-[1.01]",
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
                    "text-center py-2 px-3 rounded-lg text-xs sm:text-sm font-medium animate-in fade-in zoom-in-95 duration-200",
                    selectedAnswer === question.correctAnswer
                      ? "bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30"
                      : "bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30",
                  )}
                >
                  {selectedAnswer === question.correctAnswer ? (
                    <span>Correto! 🎉</span>
                  ) : (
                    <span>
                      Errado! A resposta correta é: <strong>{question.correctAnswer}</strong>
                    </span>
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