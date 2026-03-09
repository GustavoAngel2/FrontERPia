import React, { useState, useCallback, useRef, useMemo } from 'react'
import './ChatBot.css'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatBotResponse {
  respuesta: string
  sql?: string
  posible: boolean
  evaluacion_posibilidad?: string
  resumen?: string | null
  datos?: {
    columnas: string[]
    filas: unknown[]
    total_registros: number
  }
}

interface ChatBotProps {
  variant?: 'floating' | 'inline'
}

const MessageItem = React.memo<{ message: Message }>(({ message }) => (
  <div className={`chatbot-message ${message.sender}`}>
    <div className="message-content">{message.text}</div>
    <span className="message-time">
      {message.timestamp.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </span>
  </div>
))

MessageItem.displayName = 'MessageItem'

const ChatBot: React.FC<ChatBotProps> = ({ variant = 'floating' }) => {
  const [isOpen, setIsOpen] = useState(variant === 'inline')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! ¿Cómo puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleToggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Call the chatbot API
      const response = await fetch('http://127.0.0.1:5100/ia/consulta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pregunta: inputValue,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ChatBotResponse = await response.json()

      // Extract the response text
      const botResponseText = data.respuesta || 'No se pudo obtener una respuesta'

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error al conectar con el asistente: ${errorMessage}`,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsLoading(false)
    }
  }, [inputValue])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const isInputDisabled = useMemo(() => !inputValue.trim() || isLoading, [inputValue, isLoading])

  return (
    <>
      {/* Floating Button (only in floating mode) */}
      {variant === 'floating' && (
        <button
          className="chatbot-floating-btn"
          onClick={handleToggleOpen}
          title="Abrir chat"
        >
          <i className="bi bi-chat-dots-fill" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`chatbot-window ${
            variant === 'inline' ? 'chatbot-inline' : ''
          }`}
        >
          {/* Header */}
          <div className="chatbot-header">
            <h3>Asistente</h3>
            {variant === 'floating' && (
              <button
                className="chatbot-close-btn"
                onClick={handleToggleOpen}
                title="Cerrar"
              >
                <i className="bi bi-x-lg" />
              </button>
            )}
          </div>

          {/* Messages Container */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="chatbot-message bot">
                <div className="message-content loading">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form className="chatbot-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chatbot-input"
              placeholder="Escribe tu mensaje..."
              value={inputValue}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={isInputDisabled}
              title="Enviar"
            >
              <i className="bi bi-send-fill" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

export default React.memo(ChatBot)
