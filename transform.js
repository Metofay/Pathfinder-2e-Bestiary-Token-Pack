const fs = require('fs');
const path = require('path');

// Задайте путь к файлу bestiaries.json
const inputFilePath = path.join('C:', 'Users', 'Metof', 'AppData', 'Local', 'FoundryVTT', 'Data', 'modules', 'Pathfinder-2e-Bestiary-Token-Pack', 'bestiaries.json');
const outputFilePath = path.join('C:', 'Users', 'Metof', 'AppData', 'Local', 'FoundryVTT', 'Data', 'modules', 'Pathfinder-2e-Bestiary-Token-Pack', 'modified_bestiaries.json');

// Загрузите данные из вашего JSON файла
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error("Ошибка при чтении файла:", err);
        return;
    }

    // Парсим данные из JSON
    const jsonData = JSON.parse(data);

    // Функция для преобразования имени файла (имя файла без пути)
    function capitalizeFilename(filePath) {
        if (typeof filePath !== 'string') {
            console.error("Неверный путь к файлу:", filePath);
            return '';
        }

        // Разделяем путь и извлекаем имя файла
        const dirPath = path.dirname(filePath); // Путь к каталогу
        const fileName = path.basename(filePath); // Имя файла с расширением
        const fileExtension = path.extname(filePath); // Получаем расширение файла
        const baseName = path.basename(filePath, fileExtension); // Имя файла без расширения

        // Преобразуем первую букву каждого слова в строке
        const capitalizedName = baseName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('-');

        // Возвращаем путь с преобразованным именем файла
        return path.join(dirPath, capitalizedName + fileExtension);
    }

    // Итерируем по всем записям и обновляем имена файлов
    for (const category in jsonData) {
        const items = jsonData[category];
        for (const key in items) {
            const item = items[key];
            
            // Преобразуем для поля actor (если это строка с путем)
            if (item.actor && typeof item.actor === 'string') {
                item.actor = capitalizeFilename(item.actor);
            }

            // Преобразуем для token (если это строка с путем или объект с img)
            if (item.token) {
                // Если token - объект, и у него есть поле img
                if (item.token.img && typeof item.token.img === 'string') {
                    item.token.img = capitalizeFilename(item.token.img);
                }
                // Если token - строка с путем
                else if (typeof item.token === 'string') {
                    item.token = capitalizeFilename(item.token);
                }
            }
        }
    }

    // Записываем обновленные данные в новый JSON файл
    fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 4), (err) => {
        if (err) {
            console.error("Ошибка при записи файла:", err);
            return;
        }
        console.log("Файлы успешно обновлены и сохранены в 'modified_bestiaries.json'");
    });
});
