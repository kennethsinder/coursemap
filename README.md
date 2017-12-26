# coursemap

UW course visualization tool

[![Build Status](https://travis-ci.org/kennethsinder/coursemap.svg?branch=master)](https://travis-ci.org/kennethsinder/coursemap)

## Setup

To quickly spin up a development server:

1. `npm install`

2. `composer install`

3. `npm install -g @angular/cli`

4. `ng build`

5. `cp .env.example .env`

6. `php artisan key:generate`

7. Change DB password, etc. in `.env` file, and issue the following MySQL query: `create database if not exists 'coursemap'`

8. `php artisan migrate`

9. `php artisan serve`
