import { test, expect } from '@playwright/test';

test.describe('Product Platform End-To-End Workflows', () => {
  let products: { id: string; name: string; price: number }[];
  let nextId: number;
  
  test.beforeEach(async ({ page }) => {
    products = [
      { id: '1', name: 'Laptop', price: 75000 },
      { id: '2', name: 'Phone', price: 25000 },
    ];
    nextId = 3;

    await page.route(/\/products(?:\/.*)?$/, async route => {
      const request = route.request();

      if (request.method() === 'GET') {
        await route.fulfill({ json: products });
        return;
      }

      if (request.method() === 'POST') {
        const product = request.postDataJSON() as { name: string; price: number };
        const savedProduct = { ...product, id: String(nextId++) };
        products.push(savedProduct);
        await route.fulfill({ json: savedProduct });
        return;
      }

      if (request.method() === 'DELETE') {
        const id = new URL(request.url()).pathname.split('/').slice(-1)[0];
        products = products.filter(product => product.id !== id);
        await route.fulfill({ status: 204 });
        return;
      }

      await route.continue();
    });

    await page.goto('http://localhost:4200/');
  });

  test('should display existing products returned by the API', async ({ page }) => {
    await expect(page.locator('[data-testid="page-title"]')).toHaveText('Product Catalog');
    await expect(page.locator('.product-item').first()).toContainText('Laptop');
  });

  test('should allow creating a new product and adding it to the UI grid', async ({ page }) => {
    // Fill out form elements
    await page.fill('[data-testid="input-name"]', 'USB-C Hub');
    await page.fill('[data-testid="input-price"]', '1800');

    // Click insertion trigger button
    await page.click('[data-testid="btn-add"]');

    // Verify item is safely rendered in the view list
    const addedElement = page.locator('.product-item', { hasText: 'USB-C Hub' });
    await expect(addedElement).toBeVisible();
    await expect(addedElement).toContainText('₹1800');
  });

  test('should remove a product from display when clicking its delete button', async ({ page }) => {
    // Identify item entry target element
    const targetedItem = page.locator('.product-item', { hasText: 'Phone' });
    await expect(targetedItem).toBeVisible();

    const deleteResponse = page.waitForResponse(
      response => response.request().method() === 'DELETE' && response.url().endsWith('/products/2'),
    );
    await page.click('[data-testid="btn-delete-2"]');
    expect((await deleteResponse).status()).toBe(204);

    // Confirm node element disappears completely from client DOM tree layout
    await expect(targetedItem).not.toBeVisible();
  });
});
