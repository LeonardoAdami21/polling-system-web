import { useEffect, useState } from "react";
import { Poll } from "..";
import { pollService } from "../service/poll.service";

interface PollsListProps {
  onSelectPoll: (poll: Poll) => void;
}

const PollsList = ({ onSelectPoll }: PollsListProps) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await pollService.getPolls();
      setPolls(data);
    } catch (err) {
      console.error("Erro ao carregar enquetes:", err);
      setError("Falha ao carregar enquetes. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando enquetes...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
        <button
          className="block mx-auto mt-2 text-blue-500 underline"
          onClick={loadPolls}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (polls.length === 0) {
    return <div className="text-center py-4">Nenhuma enquete disponível.</div>;
  }

  return (
    <div className="space-y-2">
      {polls?.map((poll) => (
        <div
          key={poll.id}
          className="option"
          onClick={() => onSelectPoll(poll)}
        >
          <h3 className="font-medium">{poll.title}</h3>
          {poll.description && (
            <p className="text-gray-600 text-sm">{poll.description}</p>
          )}
          <small className="text-gray-500 block mt-1">
            Criada em: {new Date(poll.createdAt).toLocaleString()}
          </small>
          <small className="text-gray-500 block mt-1">
            Total de votos: {poll.totalVotes}
          </small>
        </div>
      ))}
    </div>
  );
};

export default PollsList;
