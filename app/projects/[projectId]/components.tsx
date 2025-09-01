'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface NewChatButtonProps {
  projectId: string
  showText?: string
}

export function NewChatButton({
  projectId,
  showText = 'New Chat',
}: NewChatButtonProps) {
  const router = useRouter()

  const handleNewChat = () => {
    router.push(`/chats/new?projectId=${projectId}`)
  }

  const isLargeButton = showText === 'Create Chat'

  return (
    <Button
      onClick={handleNewChat}
      size={isLargeButton ? 'lg' : 'default'}
      className={isLargeButton ? 'mx-auto' : ''}
    >
      <Plus className={isLargeButton ? 'w-5 h-5' : 'w-4 h-4'} />
      {showText}
    </Button>
  )
}
