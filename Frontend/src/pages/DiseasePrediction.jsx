import React, { useState } from "react";

export default function DiseasePrediction() {
  const [symptoms, setSymptoms] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAddSymptom = () => {
    if (input.trim() && !symptoms.includes(input.trim())) {
      setSymptoms([...symptoms, input.trim()]);
      setInput("");
    }
  };

  const handleRemoveSymptom = (symptom) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSymptom();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans mt-24">
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Disease Prediction & Medical Recommendation</h2>
          <p className="text-slate-600">Enter your symptoms for AI-powered diagnosis and treatment recommendations</p>
        </div>

        {/* Symptom input section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Describe your symptoms:</h3>
          <form onSubmit={handleSubmit}>
            <div className="flex mb-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow px-4 py-3 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., persistent headache, mild fever, dry cough..."
              />
              <button
                type="button"
                onClick={handleAddSymptom}
                className="bg-primary-600 text-white px-4 py-3 rounded-r-lg hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {symptoms.map((symptom, index) => (
                <span key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full flex items-center">
                  {symptom}
                  <button
                    type="button"
                    onClick={() => handleRemoveSymptom(symptom)}
                    className="ml-2 text-indigo-400 hover:text-indigo-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || symptoms.length === 0}
              className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${loading || symptoms.length === 0
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primay-700"
                }`}
            >
              {loading ? "Analyzing..." : "Analyze Symptoms"}
            </button>
          </form>
        </div>

        {/* Results section */}
        {result && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-indigo-50 p-4">
              <h3 className="text-xl font-bold text-slate-800">Prediction Results</h3>
            </div>

            <div className="p-6">
              {/* Diseases */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-slate-800 mb-3">
                  Predicted Condition{result.predictions.diseases.length > 1 ? "s" : ""}:
                </h4>
                <div className="space-y-2">
                  {result.predictions.diseases.map((disease, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-600 mr-2"></div>
                      <span className="text-primary-700 font-medium">{disease}</span>

                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="flex items-center text-lg font-semibold text-slate-800 mb-2">
                  Description
                </h4>
                <div className="bg-slate-50 p-4 rounded-lg text-slate-700">
                  {result.predictions.general_details.description
                    .filter(desc => desc !== "Not available")
                    .map((desc, idx) => (
                      <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                        {desc}
                      </p>
                    ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Diet */}
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-slate-800 mb-2">
                    Recommended Diet
                  </h4>
                  <ul className="bg-slate-50 p-4 rounded-lg text-slate-700 list-disc list-inside">
                    {result.predictions.general_details.diets.flat().map((diet, idx) => (
                      <li key={idx} className="mb-1">{diet.replace(/[\[\]']/g, "")}</li>
                    ))}
                  </ul>
                </div>

                {/* Medications */}
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-slate-800 mb-2">
                    Medications
                  </h4>
                  <ul className="bg-slate-50 p-4 rounded-lg text-slate-700 list-disc list-inside">
                    {result.predictions.general_details.medications.flat().map((med, idx) => (
                      <li key={idx} className="mb-1">{med.replace(/[\[\]']/g, "")}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Precautions */}
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-slate-800 mb-2">
                    Precautions
                  </h4>
                  <ul className="bg-slate-50 p-4 rounded-lg text-slate-700 list-disc list-inside">
                    {result.predictions.general_details.precautions.map((precaution, idx) => (
                      <li key={idx} className="mb-1 capitalize">{precaution}</li>
                    ))}
                  </ul>
                </div>

                {/* Workout */}
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-slate-800 mb-2">
                    Lifestyle Recommendations
                  </h4>
                  <ul className="bg-slate-50 p-4 rounded-lg text-slate-700 list-disc list-inside max-h-60 overflow-y-auto">
                    {result.predictions.general_details.workout.map((workout, idx) => (
                      <li key={idx} className="mb-1">{workout}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                  <p className="text-indigo-800 text-sm">
                    <strong>Important:</strong> This prediction is based on machine learning and should not replace professional medical advice. Please consult a healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setResult(null);
                    setSymptoms([]);
                  }}
                  className="w-full py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Start New Prediction
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}