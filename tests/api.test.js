const request = require('supertest');
const app = require('../server');

    test('GET /api/books returns all books', async () => {
        const response = await request(app).get('/api/books');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(3);
    });

    test('GET /api/books/:id returns a specific book', async () => {
        const response = await request(app).get('/api/books/1');

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.title).toBe('The Great Gatsby');
    });

    test('GET /api/books/:id returns 404 for missing book', async () => {
        const response = await request(app).get('/api/books/999');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    test('POST /api/books creates a new book', async () => {
        const newBook = {
            title: 'The Hunger Games',
            author: 'Suzanne Collins',
            genre: 'Dystopian Fiction',
            copiesAvailable: 5
        };

        const response = await request(app)
            .post('/api/books')
            .send(newBook);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('The Hunger Games');
        expect(response.body.copiesAvailable).toBe(5);
    });

    test('PUT /api/books/:id updates a book', async () => {
        const updatedBook = {
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            genre: 'Classic Fiction',
            copiesAvailable: 10
        };

        const response = await request(app)
            .put('/api/books/1')
            .send(updatedBook);

        expect(response.status).toBe(200);
        expect(response.body.genre).toBe('Classic Fiction');
        expect(response.body.copiesAvailable).toBe(10);
    });

    test('PUT /api/books/:id returns 404 for missing book', async () => {
        const response = await request(app)
            .put('/api/books/999')
            .send({
                title: 'Unknown Book',
                author: 'Unknown',
                genre: 'Fiction',
                copiesAvailable: 1
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    test('DELETE /api/books/:id removes a book', async () => {
        const response = await request(app).delete('/api/books/2');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');

        const checkResponse = await request(app).get('/api/books/2');
        expect(checkResponse.status).toBe(404);
    });

    test('DELETE /api/books/:id returns 404 for missing book', async () => {
        const response = await request(app).delete('/api/books/999');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
    });
