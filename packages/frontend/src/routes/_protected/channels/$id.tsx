import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSocket } from '@/hooks/use-socket';
import { queryClient } from '@/lib/query-client';
import { formatTimestamp, getInitials } from '@/lib/utils';
import { getUser } from '@/queries/auth';
import { getMessages } from '@/queries/channels';
import type { Message, PaginatedMessages } from '@discourse/shared';
import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
} from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { ChevronDown, MoveUp } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';

export const Route = createFileRoute('/_protected/channels/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { socket } = useSocket();
  const params = useParams({ strict: false });
  const id = params.id as string | undefined;
  const [inputValue, setInputValue] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    isInitialMount.current = true;
  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      if (message.channel !== id) return;

      queryClient.setQueryData(
        ['messages', message.channel],
        (oldData: InfiniteData<PaginatedMessages> | undefined) => {
          if (!oldData) return oldData;

          const newPages = [...oldData.pages];

          if (newPages.length > 0) {
            newPages[0] = {
              ...newPages[0],
              messages: [message, ...newPages[0].messages],
            };
          }

          return {
            ...oldData,
            pages: newPages,
          };
        },
      );
    };

    socket.on('message', handleNewMessage);

    return () => {
      socket.off('message', handleNewMessage);
    };
  }, [socket, queryClient, id]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['messages', id],
      queryFn: ({ pageParam }) => getMessages(id!, pageParam),
      getNextPageParam: (lastPage) => {
        return lastPage.more ? lastPage.next : undefined;
      },
      initialPageParam: undefined as string | undefined,
      select: (data) => ({
        pages: [...data.pages].reverse().map((page) => ({
          ...page,
          messages: [...page.messages].reverse(),
        })),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const messages = data?.pages.flatMap((page) => page.messages) ?? [];

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    setShowScrollButton(distanceFromBottom > 200);

    if (scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (!isLoading && messages.length > 0 && isInitialMount.current) {
      messagesEndRef.current?.scrollIntoView();
      isInitialMount.current = false;
    }
  }, [isLoading, messages.length]);

  const { data: user } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const handleSend = (event: FormEvent) => {
    event.preventDefault();
    if (inputValue.trim()) {
      socket?.emit('message', {
        content: inputValue,
        channel: id,
      });
      setInputValue('');

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="flex justify-center h-full">
      <div className="h-full max-w-3xl px-2 w-full">
        <div className="w-full h-full flex flex-col">
          <div className="relative flex-1 overflow-hidden min-h-0">
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto p-4 space-y-4 no-scrollbar"
            >
              {isFetchingNextPage && (
                <div className="flex justify-center py-2">
                  <div className="bg-sidebar border text-gray-600 text-xs px-3 py-1 rounded-full">
                    Loading older messages...
                  </div>
                </div>
              )}

              {!hasNextPage && !isLoading && (
                <div className="flex justify-center py-2">
                  <div className="bg-sidebar border text-gray-600 text-xs px-3 py-1 rounded-full">
                    Beginning of conversation
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.message}
                  className={`flex gap-2 ${message.user === user?.id ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={message.picture} alt={message.name} />
                    <AvatarFallback>{getInitials(message.name)}</AvatarFallback>
                  </Avatar>

                  <div
                    className={`flex flex-col ${message.user === user?.id ? 'items-end' : 'items-start'}`}
                  >
                    <span
                      className={`text-xs font-medium mb-1 ${
                        message.user === user?.id
                          ? 'text-gray-600'
                          : 'text-gray-700'
                      }`}
                    >
                      {message.name}
                    </span>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                        message.user === user?.id
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-sidebar border text-gray-800 rounded-tl-none'
                      }`}
                    >
                      <p className="text-sm wrap-break-word">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          message.user === user?.id
                            ? 'text-teal-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {formatTimestamp(message.message)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {showScrollButton && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <Button
                  onClick={scrollToBottom}
                  size="icon-sm"
                  className="rounded-sm  bg-blue-600 hover:bg-blue-700 shadow-lg"
                >
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>

          <div className="bg-sidebar p-4 border-t border-r border-l rounded-t-lg border-gray-200 shrink-0">
            <form className="flex items-center gap-2" onSubmit={handleSend}>
              <Input
                type="text"
                placeholder="Type a message"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-white"
              />
              <Button type="submit" size="icon">
                <MoveUp className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
