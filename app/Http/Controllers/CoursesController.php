<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CoursesController extends Controller
{
    private function getUwApiResponse($query)
    {
        $client = new \GuzzleHttp\Client;
        $url = "https://api.uwaterloo.ca/v2/$query.json?key=" . env('UW_API_KEY', '');
        $settings = ['verify' => false];
        try {
            $response = $client->get($url, $settings);
        }
        catch (\Exception $e) {
            return [];
        }

        if ($response->getStatusCode() != 200) {
            // TODO: error handling
            return [];
        }

        return json_decode($response->getBody(), true)['data'];
    }

    private function importCourses()
    {
        $courses = $this->getUwApiResponse('courses');
        $subjects = [];

        foreach ($courses as $course) {
            if (!in_array($course['subject'], $subjects)) {
                array_push($subjects, $course['subject']);
            }
        }

        foreach ($subjects as $subject) {
            $coursesFromSubject = $this->getUwApiResponse("courses/$subject");
            foreach ($coursesFromSubject as $course) {
                $courseObj = \App\Course::FirstOrNew([
                    'subject' => $course['subject'], 
                    'catalog_number' => $course['catalog_number']
                ], [
                    'title' => $course['title'],
                    'units' => $course['units'],
                    'description' => $course['description'],
                ]);

                $courseObj->save();
            }
        }
    }

    public function getAllCourses()
    {
        return \App\Course::all();
    }
}
