interface OptionInputProps {
  onRemove: () => void;
  onChange: (value: string) => void;
  value: string;
  showRemoveButton: boolean;
}

const OptionInput = ({
  onRemove,
  onChange,
  value,
  showRemoveButton,
}: OptionInputProps) => {
  return (
    <div className="flex mb-2">
      <input
        type="text"
        className="flex-1 mr-2 p-2 border border-gray-300 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      {showRemoveButton && (
        <button
          type="button"
          onClick={onRemove}
          className="bg-red-500 text-white px-3 rounded hover:bg-red-600"
        >
          X
        </button>
      )}
    </div>
  );
};

export default OptionInput;
