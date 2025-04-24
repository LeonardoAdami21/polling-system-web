import React, { useState } from "react";
import PollView from "./components/PollView";
import { Poll } from ".";
import CreatePollForm from "./components/CreatePollForm";
import PollsList from "./components/PollList";

const App: React.FC = () => {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);

  return (
    <div className="max-w-4xl mx-auto p-5 font-sans">
      <h1 className="text-2xl font-bold mb-6">
        Sistema de Enquetes em Tempo Real
      </h1>

      {currentPoll ? (
        <PollView poll={currentPoll} onBack={() => setCurrentPoll(null)} />
      ) : (
        <div className="flex gap-5 flex-col md:flex-row">
          <div className="section">
            <h2 className="text-xl font-semibold mb-4">Criar Nova Enquete</h2>
            <CreatePollForm onPollCreated={() => {}} />
          </div>

          <div className="section">
            <h2 className="text-xl font-semibold mb-4">Enquetes Disponíveis</h2>
            <PollsList onSelectPoll={setCurrentPoll} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
