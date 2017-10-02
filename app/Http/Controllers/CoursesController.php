<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CoursesController extends Controller
{
    public function getAllCourses()
    {
        $client = new \GuzzleHttp\Client;
        $url = 'https://api.uwaterloo.ca/v2/courses.json?key=' . env('UW_API_KEY', '');
        $settings = ['verify' => false];
        $response = $client->get($url, $settings);

        return json_decode($response->getBody(), true);
    }
}
