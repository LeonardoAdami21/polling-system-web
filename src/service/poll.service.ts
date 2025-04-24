import { Poll, VoteDto } from "..";
import { api } from "./api";

interface CreatePollFormData {
  title: string;
  description: string;
  options: { text: string }[];
}

export const pollService = {
  getPolls: async (): Promise<Poll[]> => {
    const response = await api.get("/polls");
    return response.data;
  },

  getPoll: async (pollId: string): Promise<Poll> => {
    const response = await api.get(`/polls/${pollId}`);
    return response.data;
  },

  createPoll: async (dto: CreatePollFormData): Promise<Poll> => {
    const response = await api.post("/polls", dto);
    return response.data;
  },

  vote: async (pollId: string, optionId: string): Promise<Poll> => {
    try {
      const dto: VoteDto = { optionId };
      const poll = await pollService.getPoll(pollId);
      if (!poll) {
        throw new Error("Enquete não encontrada");
      }
      const response = await api.post(`/polls/${pollId}/vote`, {
        optionId: dto.optionId,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error(
          error.response.data.message || "Enquete ou opção não encontrada",
        );
      } else if (error.response?.data?.code === "P2002") {
        throw new Error("Você já votou nesta enquete");
      } else {
        throw new Error(
          error.response?.data?.message || "Erro ao registrar voto",
        );
      }
    }
  },
};
