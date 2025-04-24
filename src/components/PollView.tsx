import { useState, useEffect } from "react";
import { Poll } from "..";
import { disconnectSocket, getSocket } from "../service/api";
import { pollService } from "../service/poll.service";
import { reactViteBackendUrl } from "../env/envoriment";

interface PollViewProps {
  poll: Poll;
  onBack: () => void;
}

const PollView = ({ poll: initialPoll, onBack }: PollViewProps) => {
  const [poll, setPoll] = useState<Poll>({
    ...initialPoll,
    options: initialPoll.options || [],
    totalVotes: initialPoll.totalVotes || 0,
  });
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // Configurar socket para atualizações em tempo real
    const socket = getSocket(`${reactViteBackendUrl}`);

    socket.on("connect", () => {
      console.log("Conectado ao WebSocket");
      socket.emit("joinPoll", poll.id);
    });

    socket.on("pollUpdate", (updatedPoll: Poll) => {
      console.log("Recebendo atualização em tempo real:", updatedPoll);
      setPoll(updatedPoll);
    });

    return () => {
      disconnectSocket();
    };
  }, [poll.id]);

  const handleVote = async () => {
    if (!selectedOptionId) {
      alert("Selecione uma opção para votar!");
      return;
    }

    try {
      setIsVoting(true);
      console.log("Iniciando processo de votação...");
      const updatedPoll = await pollService.vote(
        poll.id,
        selectedOptionId.toString(),
      );
      setPoll(updatedPoll);
      setHasVoted(true);
      alert("Voto registrado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao votar:", error);
      alert("Ocorreu um erro ao registrar seu voto.");
    } finally {
      setIsVoting(false);
    }
  };

  const calculatePercentage = (votes: number, totalVotes: number) => {
    if (!totalVotes) return 0;
    const result = (votes / totalVotes) * 100;
    return isNaN(result) ? 0 : result;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-2">{poll.title}</h2>
      {poll.description && (
        <p className="text-gray-600 mb-6">{poll.description}</p>
      )}

      {!hasVoted && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Vote em uma opção:</h3>
          <div className="space-y-2">
            {poll.options.map((option) => (
              <div
                key={option.id}
                className={`option ${selectedOptionId === option.id ? "selected" : ""}`}
                onClick={() => setSelectedOptionId(option.id)}
              >
                {option.text}
              </div>
            ))}
          </div>
          <button
            className="btn mt-4"
            onClick={handleVote}
            disabled={isVoting || !selectedOptionId}
          >
            {isVoting ? "Enviando..." : "Votar"}
          </button>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Resultados em tempo real:</h3>
        <p className="text-sm text-gray-600 mb-3">
          Total de votos: {Number(poll.totalVotes).toString() || 0}
        </p>

        <div className="space-y-3">
          {poll?.options?.length > 0 &&
            poll?.options?.map((option) => {
              const percentage = calculatePercentage(
                option.votes,
                Number(poll.totalVotes) || 0,
              );

              return (
                <div key={option.id}>
                  <div className="flex justify-between text-sm">
                    <span>{option.text}</span>
                    <span className="text-gray-600">
                      {option.votes} votos ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 text-xs text-white flex items-center justify-center"
                      style={{
                        width: `${percentage > 0 ? Math.max(percentage, 5) : 0}%`,
                      }}
                    >
                      {percentage > 10 ? `${percentage.toFixed(1)}%` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <button
        className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        onClick={onBack}
      >
        Voltar para a lista
      </button>
    </div>
  );
};

export default PollView;
