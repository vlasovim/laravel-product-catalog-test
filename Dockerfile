# Not for production use

FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    nodejs \
    npm \
    sqlite3

RUN docker-php-ext-install pdo pdo_pgsql

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN cp .env.example .env

RUN composer install --no-interaction
RUN npm install && npm run build

CMD php artisan key:generate \
 && php artisan migrate:fresh --seed --force \
 && php artisan test --stop-on-failure \
 && php artisan serve --host=0.0.0.0 --port=8000
