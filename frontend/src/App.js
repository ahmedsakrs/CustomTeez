import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import ProductsScreen from "./screens/ProductsScreen";
import DesignsCategoriesScreen from "./screens/DesignsCategoriesScreen";
import DesignCategoryScreen from "./screens/DesignCategoryScreen";
import DesignerScreen from "./screens/DesignerScreen";

function App() {
  return (
    <Router>
      <Header />
      <main className="py-1">
        <Routes>
          <Route
            path="/"
            element={
              <Container>
                <HomeScreen />
              </Container>
            }
            exact
          />

          <Route
            path="/products/"
            element={
              <Container>
                <ProductsScreen />
              </Container>
            }
          />
          <Route path="/products/:id/">
            <Route
              index
              element={
                <Container>
                  <ProductScreen />
                </Container>
              }
            />
            <Route
              path=":color"
              element={
                <Container>
                  <ProductScreen />
                </Container>
              }
            />
          </Route>

          <Route
            path="/designCategories/"
            element={
              <Container>
                <DesignsCategoriesScreen />
              </Container>
            }
          />
          <Route
            path="/designCategories/:categoryID/"
            element={
              <Container>
                <DesignCategoryScreen />
              </Container>
            }
          />

          <Route
            path="/designer/"
            element={
              <Container fluid className="p-1">
                <DesignerScreen />
              </Container>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
