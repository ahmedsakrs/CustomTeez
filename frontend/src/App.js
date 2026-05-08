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
import DesignerScreen from './screens/DesignerScreen';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} exact />
            
            <Route path="/products/" element={<ProductsScreen />} />
            <Route path="/products/:id/">
              <Route index element={<ProductScreen />} />
              <Route path=":color" element={<ProductScreen />} />
            </Route>

            <Route path="/designCategories/" element={<DesignsCategoriesScreen />} />
            <Route path="/designCategories/:categoryID/" element={<DesignCategoryScreen />} />

            <Route path="/designer/" element={<DesignerScreen/>}/>
            
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
