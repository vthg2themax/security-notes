<x-app-layout>
    <div class="pt-5">
        <h1 class="pt-3">
            {{ __('Profile') }}
        </h1>
        <div class="container">
            <div class="row bg-white shadow">
                @include('profile.partials.update-profile-information-form')
            </div>

            <div class="row bg-white shadow">
                @include('profile.partials.update-password-form')
            </div>

            <div class="row bg-white shadow">
                @include('profile.partials.delete-user-form')
            </div>
        </div>
    </div>
</x-app-layout>
