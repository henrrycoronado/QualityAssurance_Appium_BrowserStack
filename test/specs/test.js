const { expect } = require('@wdio/globals');

describe('Prueba de Búsqueda Web (Google)', () => {

    it('Debería abrir Google, buscar BrowserStack y validar el título', async () => {
        // 1. Abrir Google
        await browser.url('https://www.google.com');

        // 2. Manejar el pop-up de consentimiento (si aparece)
        try {
            // Usamos un selector XPath que busca un botón cuyo texto (o texto hijo) sea "Rechazar todo"
            const rejectButton = await $('//*[text()="Rechazar todo"] | //button[contains(., "Rechazar todo")]');
            await rejectButton.waitForDisplayed({ timeout: 5000 });
            await rejectButton.click();
        } catch (e) {
            console.log('No se encontró el pop-up de cookies, continuando...');
        }

        // 3. Encontrar la barra de búsqueda (por el atributo 'name')
        const searchBar = await $('[name="q"]');
        await searchBar.waitForDisplayed({ timeout: 5000 });
        
        // 4. Escribir "BrowserStack" y presionar Enter
        // \n simula la tecla "Enter"
        await searchBar.setValue('BrowserStack\n'); 

        // 5. Esperar a que el título de la página de resultados se cargue
        await browser.waitUntil(
            async () => (await browser.getTitle()).includes('BrowserStack'),
            {
                timeout: 10000,
                timeoutMsg: 'El título de la página no contenía "BrowserStack" a tiempo'
            }
        );

        // 6. Validación final
        await expect(browser).toHaveTitleContaining('BrowserStack');
    });
});
