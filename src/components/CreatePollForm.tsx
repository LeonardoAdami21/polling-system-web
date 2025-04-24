import { useState, FormEvent } from "react";
import { pollService } from "../service/poll.service";

interface CreatePollFormProps {
  onPollCreated: () => void;
}

const CreatePollForm = ({ onPollCreated }: CreatePollFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      alert("Uma enquete precisa ter pelo menos 2 opções!");
      return;
    }

    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (options.some((option) => !option.trim())) {
      alert("Todas as opções devem ser preenchidas!");
      return;
    }

    try {
      setIsSubmitting(true);
      await pollService.createPoll({
        title,
        description,
        options: options.map((option) => ({ text: option.trim() })),
      });

      // Limpar formulário
      setTitle("");
      setDescription("");
      setOptions(["", ""]);

      // Notificar criação bem-sucedida
      onPollCreated();
      alert("Enquete criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar enquete:", error);
      alert("Ocorreu um erro ao criar a enquete.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title" className="block mb-1">
          Título:
        </label>
        <input
          type="text"
          id="title"
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="block mb-1">
          Descrição:
        </label>
        <textarea
          id="description"
          className="input-field"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="block mb-1">Opções:</label>
        <div className="space-y-2.5">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                className="input-field flex-1"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              <button
                type="button"
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleRemoveOption(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-2 text-blue-500 underline"
          onClick={handleAddOption}
        >
          Adicionar Opção
        </button>
      </div>

      <button type="submit" className="btn" disabled={isSubmitting}>
        {isSubmitting ? "Criando..." : "Criar Enquete"}
      </button>
    </form>
  );
};

export default CreatePollForm;
