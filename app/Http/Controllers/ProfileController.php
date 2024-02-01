<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;
use Log;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as symfony_component_http_foundation_response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): View
    {
        return view('profile.edit', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->validate([
            'name' => 'required',
            'email' => 'required|email'
        ]);

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Update the user's profile information by id.
     */
    public function update_by_id(Request $request, string $id): Response
    {
        $user = $request->user();

        $user_for_id = $user::where('id',$id)->first();

        if ($user->id != $user_for_id->id) {
            return new Response("Permission Denied", symfony_component_http_foundation_response::HTTP_FORBIDDEN);
        }

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $contents = $_REQUEST["profile_image"];
        //Remove the first part of the url info
        $contents = str_replace('data:image/png;base64,','', $contents);
        $contents = base64_decode($contents);

        $request->user()->profile_image = $contents;

        $request->validate([
            //'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
            'profile_image' => 'required|max:204899'
        ]);

        $request->user()->save();

        return new Response("I like birds!", symfony_component_http_foundation_response::HTTP_OK);
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
