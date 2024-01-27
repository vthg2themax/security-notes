@props(['dropdownText' => '', ])

@php

@endphp

<div class="dropdown">
    <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown"
       aria-expanded="false">
        {{ $dropdownText }}
    </a>

    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
        {{ $content }}
    </ul>
</div>
