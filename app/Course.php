<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['subject', 'catalog_number', 'title', 'description', 'units'];

    public function term()
    {
    	return $this->belongsToMany(\App\Term::class);
    }
}
