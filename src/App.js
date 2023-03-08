import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { openDB } from 'idb';

function App() {
  const [productName, setProductName] = useState('');
  const [productCost, setProductCost] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [productQuantity, setProductQuantity] = useState(0);
  const [products, setProducts] = useState([]);

  const pvn = 0.79;
  const onlyPvn = 0.21;

  useEffect(() => {
    const password = 'qwerty';
    const enteredPassword = prompt('Ievadi paroli divas reizes, lai lietotu programmu');
    if (enteredPassword !== password) {
      alert('Nepareiza parole, mēģini velreiz');
      window.location.reload();
    } else {
      async function fetchProducts() {
        const db = await openDB('mydb', 1, {
          upgrade(db) {
            db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
          }
        });
        const data = await db.getAll('products');
        setProducts(data);
      }
      fetchProducts();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!productName || productPrice <= 0 || productQuantity <= 0) {
      alert('Aizpildi visus laukus!');
      return;
    }
    const newProduct = { name: productName, cost: productCost, price: productPrice, quantity: productQuantity };
    const db = await openDB('mydb', 1, {
      upgrade(db) {
        db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
      }
    });
    const productId = await db.add('products', newProduct);
    setProducts([...products, { ...newProduct, id: productId }]);
    setProductName('');
    setProductCost(0);
    setProductPrice(0);
    setProductQuantity(0);
  };
  
  
  const handleCostChange = (event) => {
    const cost = parseFloat(event.target.value);
    if (cost < 0) {
      setProductCost(0);
    } else {
      setProductCost(parseFloat(cost.toFixed(2)));
    }
  };

  const handlePriceChange = (event) => {
    const price = parseFloat(event.target.value);
    if (price < 0) {
      setProductPrice(0);
    } else {
      setProductPrice(parseFloat(price.toFixed(2)));
    }
  };

  const handleQuantityChange = (event) => {
    const quantity = parseInt(event.target.value);
    if (quantity < 0) {
      setProductQuantity(0);
    } else {
      setProductQuantity(quantity);
    }
  };

  const handleClearTable = async () => {
    const db = await openDB('mydb', 1);
    await db.clear('products');
    setProductName('');
    setProductCost(0);
    setProductPrice(0);
    setProductQuantity(0);
    setProducts([]);
    console.log('All products deleted from database.');
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={3}>
          <h2>Pievienot preci</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="productName">Produkts:</Label>
              <Input type="text" id="productName" value={productName} onChange={(event) => setProductName(event.target.value)} required />
            </FormGroup>
            <FormGroup>
              <Label for="productCost">Pašizmaksas cena €:</Label>
              <Input type="number" step="0.01" id="productCost" value={productCost} onChange={handleCostChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="productPrice">Pārdošanas cena €:</Label>
              <Input type="number" step="0.01" id="productPrice" value={productPrice} onChange={handlePriceChange} required />
            </FormGroup>
            <FormGroup>
              <Label for="productQuantity">Daudzums:</Label>
              <Input type="number" id="productQuantity" value={productQuantity} onChange={handleQuantityChange} required />
            </FormGroup>
            <Button type="submit">Pievienot</Button>{" "}
            <Button onClick={handleClearTable}>Notīrīt tabulu</Button>
          </Form>
        </Col>
        <Col md={9}>
          <h2>Tabula</h2>
          <Table>
            <thead>
              <tr>
                <th>Produkts</th>
                <th>Pašizmaksas cena €</th>
                <th>Pārdošanas cena €</th>
                <th>Daudzums</th>
                <th>Peļņa pirms PVN €</th>
                <th>PVN €</th>
                <th>Peļņa pēc PVN €</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.cost}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{(product.price * product.quantity - product.cost * product.quantity).toFixed(2)}</td>
                  <td>{((product.price * product.quantity - product.cost * product.quantity) * onlyPvn).toFixed(2)}</td>
                  <td>{((product.price * product.quantity - product.cost * product.quantity) * pvn).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;