import React, { useState } from "react";
import "./Survey.css";
import { useNavigate } from "react-router-dom";
import { useSubmitUserPreferencesMutation } from "../../reducer/userPreferencesApi.ts";

const foodOptions = [
  "Pizza",
  "Pasta",
  "Burgers",
  "Sushi",
  "Steaks",
  "Seafood",
  "Desserts",
  "Salads",
  "Soups",
  "BBQ",
  "Vegan",
  "Tacos",
  "Asian",
  "Coffee",
  "Wine",
  "Juice",
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const partsOfDay = ["Breakfast", "Lunch", "Dinner"];

export default function Survey() {
  const [step, setStep] = useState(1);
  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);
  const [visitPreferences, setVisitPreferences] = useState<string[]>([]);
  const navigate = useNavigate();

  // Use RTK Query mutation hook
  const [submitUserPreferences] = useSubmitUserPreferencesMutation();

  const handleToggle = (
    value: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    const surveyData = { foodPreferences, visitPreferences };
    try {
      await submitUserPreferences(surveyData).unwrap();
      navigate("/restaurants");
    } catch (error) {
      // Optionally handle error
    }
  };

  const midIndex = Math.ceil(foodOptions.length / 2);
  const foodColumn1 = foodOptions.slice(0, midIndex);
  const foodColumn2 = foodOptions.slice(midIndex);

  return (
    <div className="survey-container">
      <div className="survey-card">
        {step === 1 && (
          <>
            <h2>🍽️ Your Favorite Foods & Drinks</h2>
            <p>Select all that apply:</p>
            <div className="survey-options-columns">
              <div className="survey-column">
                {foodColumn1.map((food) => (
                  <label key={food} className="survey-option">
                    <input
                      type="checkbox"
                      checked={foodPreferences.includes(food)}
                      onChange={() =>
                        handleToggle(food, foodPreferences, setFoodPreferences)
                      }
                    />
                    {food}
                  </label>
                ))}
              </div>
              <div className="survey-column">
                {foodColumn2.map((food) => (
                  <label key={food} className="survey-option">
                    <input
                      type="checkbox"
                      checked={foodPreferences.includes(food)}
                      onChange={() =>
                        handleToggle(food, foodPreferences, setFoodPreferences)
                      }
                    />
                    {food}
                  </label>
                ))}
              </div>
            </div>
            <div className="survey-buttons-right">
              <button
                className="survey-button"
                onClick={() => setStep(2)}
                disabled={foodPreferences.length === 0}
              >
                Next ➡️
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h4>Parts of the Day</h4>
            <h2>📅 Restaurant Visit Times</h2>
            <p>Select when you usually visit restaurants:</p>
            <div className="survey-matrix">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    {partsOfDay.map((time) => (
                      <th key={time}>{time}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {daysOfWeek.map((day) => (
                    <tr key={day}>
                      <td>{day.slice(0, 3)}</td>
                      {partsOfDay.map((time) => {
                        const id = `${day}-${time}`;
                        const isChecked = visitPreferences.includes(id);
                        return (
                          <td key={time}>
                            <label className="matrix-cell">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() =>
                                  handleToggle(
                                    id,
                                    visitPreferences,
                                    setVisitPreferences
                                  )
                                }
                              />
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="survey-buttons">
              <button className="survey-button" onClick={() => setStep(1)}>
                ⬅️ Back
              </button>
              <button
                className="survey-button"
                onClick={handleSubmit}
                disabled={visitPreferences.length === 0}
              >
                Submit ✅
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
