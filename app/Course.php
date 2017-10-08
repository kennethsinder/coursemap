<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['subject', 'catalog_number', 'title', 'description', 'units'];

    public function prerequisites()
    {
    	return $this->belongsToMany(\App\Course::class, 'course_prerequisites',
    		'course_id', 'prerequisite_id');
    }

    public function corequisites()
    {
    	return $this->belongsToMany(\App\Course::class, 'course_corequisites',
    		'course_id', 'corequisite_id');
    }

    public function antirequisites()
    {
    	return $this->belongsToMany(\App\Course::class, 'course_antirequisites',
    		'course_id', 'antirequisite_id');
    }

    public function term()
    {
    	return $this->belongsToMany(\App\Term::class);
    }
}
