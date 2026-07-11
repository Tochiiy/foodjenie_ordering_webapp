import React, { useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import api from "../utils/api"

const RecipeGenerator = () => {
  const { isAuthenticated } = useSelector((state) => state.user)
  const [ingredients, setIngredients] = useState("")
  const [recipe, setRecipe] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [history, setHistory] = useState([])

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      setError("Please enter ingredients")
      return
    }
    setError("")
    setLoading(true)
    setRecipe("")

    try {
      const { data } = await api.post("/v1/ai/recipe/generate", { ingredients })
      setRecipe(data.recipe)
      setHistory((prev) => [{ ingredients, recipe: data.recipe }, ...prev])
    } catch {
      setError("Failed to generate recipe. Try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-lg p-5" style={{ borderRadius: "16px" }}>
              <h4 className="fw-bold mb-3">Login Required</h4>
              <p className="text-muted mb-4">Only logged-in users can access the AI Recipe Generator.</p>
              <Link to="/login" className="btn btn-lg text-white fw-semibold border-0 px-5" style={{ backgroundColor: "#078347", borderRadius: "10px" }}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          <div className="card border-0 shadow-lg" style={{ borderRadius: "16px" }}>
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold" style={{ color: "#1a1a2e" }}>AI Recipe Generator</h3>
                <p className="text-muted">Enter ingredients and get a recipe</p>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Ingredients</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="e.g. rice, onion, tomato, chicken"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  style={{ borderRadius: "10px", padding: "12px 16px", fontSize: "1rem" }}
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button
                className="btn btn-lg w-100 text-white fw-semibold border-0"
                style={{ backgroundColor: "#078347", borderRadius: "10px", padding: "14px" }}
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <span>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Generating...
                  </span>
                ) : (
                  "Generate Recipe"
                )}
              </button>

              {recipe && (
                <div className="mt-4">
                  <div className="p-4" style={{ background: "#f8fffa", borderRadius: "12px", border: "1px solid #cde7cf" }}>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "1rem", margin: 0 }}>
                      {recipe}
                    </pre>
                  </div>
                </div>
              )}

              {history.length > 1 && (
                <div className="mt-5">
                  <h5 className="fw-bold mb-3">History</h5>
                  {history.slice(1).map((item, i) => (
                    <div
                      key={i}
                      className="p-3 mb-2"
                      style={{ background: "#f5f5f5", borderRadius: "8px", cursor: "pointer" }}
                      onClick={() => setRecipe(item.recipe)}
                    >
                      <p className="fw-semibold mb-1">{item.ingredients}</p>
                      <p className="text-muted small mb-0">Click to view recipe</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeGenerator
