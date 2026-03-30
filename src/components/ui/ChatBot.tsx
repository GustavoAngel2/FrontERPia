import React, { useState, useCallback, useRef, useMemo } from 'react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import './ChatBot.css'

import { useAuth } from '../../utils/auth'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  tableData?: {
    columnas: string[]
    filas: Record<string, unknown>[]
    total_registros: number
  }
  sql?: string
}

interface ChatBotResponse {
  datos?: {
    columnas: string[]
    filas: unknown[]
    total_registros: number
  }
}

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return JSON.stringify(value)
}

const formatChatBotResponse = (data: ChatBotResponse): string => {
  const lines: string[] = []

  const total = data.datos?.total_registros
  if (typeof total === 'number') {
    lines.push(`Total de registros: ${total}`)
  }

  return lines.join('\n\n').trim() || 'No se pudo obtener una respuesta'
}

interface ChatBotProps {
  variant?: 'floating' | 'inline'
}

const CHATBOT_HISTORY_KEY = 'chatbot-history-v1'
const AUTH_USER_KEY = 'auth_user'
const CHATBOT_HISTORY_FIELD = 'chatbotHistoryV1'

const getDefaultMessages = (): Message[] => [
  {
    id: '1',
    text: '¡Hola! ¿Cómo puedo ayudarte hoy?',
    sender: 'bot',
    timestamp: new Date(),
  },
]

const getHistoryStorageKey = (userId: number | string): string => {
  return `${CHATBOT_HISTORY_KEY}:user-${userId}`
}

const parseStoredMessages = (stored: string): Message[] => {
  const parsed = JSON.parse(stored) as Array<Omit<Message, 'timestamp'> & { timestamp: string }>
  if (!Array.isArray(parsed) || parsed.length === 0) return getDefaultMessages()

  return parsed.map((message) => ({
    ...message,
    timestamp: new Date(message.timestamp),
  }))
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

const loadMessagesFromStorage = (userId: number | string): Message[] => {
  try {
    if (userId !== 'guest') {
      const authStored = localStorage.getItem(AUTH_USER_KEY)
      if (authStored) {
        const authUser = JSON.parse(authStored) as unknown
        if (isRecord(authUser) && Array.isArray(authUser[CHATBOT_HISTORY_FIELD])) {
          return parseStoredMessages(JSON.stringify(authUser[CHATBOT_HISTORY_FIELD]))
        }
      }
    }

    const legacyStored = localStorage.getItem(getHistoryStorageKey(userId))
    if (!legacyStored) return getDefaultMessages()

    return parseStoredMessages(legacyStored)
  } catch {
    return getDefaultMessages()
  }
}

const saveMessagesToStorage = (userId: number | string, messages: Message[]): void => {
  if (userId === 'guest') {
    localStorage.setItem(getHistoryStorageKey(userId), JSON.stringify(messages))
    return
  }

  try {
    const authStored = localStorage.getItem(AUTH_USER_KEY)
    if (!authStored) {
      localStorage.setItem(getHistoryStorageKey(userId), JSON.stringify(messages))
      return
    }

    const authUser = JSON.parse(authStored) as unknown
    if (!isRecord(authUser)) {
      localStorage.setItem(getHistoryStorageKey(userId), JSON.stringify(messages))
      return
    }

    const updatedAuthUser: Record<string, unknown> = {
      ...authUser,
      [CHATBOT_HISTORY_FIELD]: messages,
    }

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedAuthUser))
    localStorage.removeItem(getHistoryStorageKey(userId))
  } catch {
    localStorage.setItem(getHistoryStorageKey(userId), JSON.stringify(messages))
  }
}

const buildExportRows = (
  tableData: NonNullable<Message['tableData']>,
): Record<string, string | number | boolean | null>[] => {
  return tableData.filas.map((fila) => {
    const row: Record<string, string | number | boolean | null> = {}
    tableData.columnas.forEach((columna) => {
      const value = fila[columna]
      if (value === null || value === undefined) {
        row[columna] = null
      } else if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        row[columna] = value
      } else {
        row[columna] = JSON.stringify(value)
      }
    })
    return row
  })
}

const getExportFileBaseName = (messageId: string): string => {
  const now = new Date()
  const datePart = now.toISOString().slice(0, 10)
  return `chatbot-tabla-${datePart}-${messageId}`
}

const exportTableAsXlsx = (messageId: string, tableData: NonNullable<Message['tableData']>) => {
  const rows = buildExportRows(tableData)
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: tableData.columnas })
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados')
  XLSX.writeFile(workbook, `${getExportFileBaseName(messageId)}.xlsx`)
}

const exportTableAsPdf = (messageId: string, tableData: NonNullable<Message['tableData']>) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
  const body = tableData.filas.map((fila) => tableData.columnas.map((columna) => formatValue(fila[columna])))

  autoTable(doc, {
    head: [tableData.columnas],
    body,
    margin: { top: 40, left: 20, right: 20, bottom: 20 },
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [102, 126, 234] },
  })

  doc.save(`${getExportFileBaseName(messageId)}.pdf`)
}

const MessageItem = React.memo<{ message: Message }>(({ message }) => {
  const hasTable = !!message.tableData && message.tableData.filas.length > 0

  return (
    <div className={`chatbot-message ${message.sender}`}>
      <div className="message-content">
        {message.text}
        {hasTable && (
          <>
            <div className="chatbot-table-actions">
              <button
                type="button"
                className="chatbot-export-btn"
                onClick={() => {
                  if (message.tableData) {
                    exportTableAsXlsx(message.id, message.tableData)
                  }
                }}
                title="Exportar a Excel"
              >
                XLSX
              </button>
              <button
                type="button"
                className="chatbot-export-btn"
                onClick={() => {
                  if (message.tableData) {
                    exportTableAsPdf(message.id, message.tableData)
                  }
                }}
                title="Exportar a PDF"
              >
                PDF
              </button>
            </div>
            <div className="chatbot-table-wrapper">
              <table className="chatbot-table">
                <thead>
                  <tr>
                    {message.tableData?.columnas.map((columna) => (
                      <th key={columna}>{columna}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {message.tableData?.filas.map((fila, rowIndex) => (
                    <tr key={`${message.id}-${rowIndex}`}>
                      {message.tableData?.columnas.map((columna) => (
                        <td key={`${message.id}-${rowIndex}-${columna}`}>
                          {formatValue(fila[columna])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <span className="message-time">
        {message.timestamp.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
  )
})

MessageItem.displayName = 'MessageItem'

const ChatBot: React.FC<ChatBotProps> = ({ variant = 'floating' }) => {
  const { user } = useAuth()
  const activeUserId = user?.Id ?? 'guest'
  const [isOpen, setIsOpen] = useState(variant === 'inline')
  const [messages, setMessages] = useState<Message[]>(() => loadMessagesFromStorage(activeUserId))
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
      const response = await fetch('http://187.77.10.190:8000/ia/consulta', {
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

      const botResponseText = formatChatBotResponse(data)
      const columnas = data.datos?.columnas ?? []
      const filas = (data.datos?.filas ?? []) as Record<string, unknown>[]
      const totalRegistros = data.datos?.total_registros ?? filas.length
      const hasTableData = columnas.length > 0 && filas.length > 0

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
        tableData: hasTableData
          ? {
              columnas,
              filas,
              total_registros: totalRegistros,
            }
          : undefined,
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

  React.useEffect(() => {
    console.log('auth_user localStorage:', localStorage.getItem(AUTH_USER_KEY))
  }, [])

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  React.useEffect(() => {
    setMessages(loadMessagesFromStorage(activeUserId))
  }, [activeUserId])

  React.useEffect(() => {
    saveMessagesToStorage(activeUserId, messages)
  }, [activeUserId, messages])

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
