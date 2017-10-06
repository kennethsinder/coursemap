<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['subject', 'catalog_number', 'title', 'description', 'units'];
}
