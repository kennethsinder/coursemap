# coursemap
UW course visualization tool

## Setup

To quickly spin up a development server:

1. `npm install`

2. `composer install`

3. `npm install -g @angular/cli`

4. `ng build`

5. `php artisan key:generate`

6. Change DB password, etc. in `.env` file, and `create database if not exists 'coursemap'`

7. `php artisan migrate`

8. `php artisan serve`
