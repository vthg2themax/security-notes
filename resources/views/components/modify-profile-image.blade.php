@props(['user_id' => -1])

@vite(['resources/js/filerobot-image-editor.min.js', 
       'resources/js/modify-profile-image.js',
       'resources/css/modify-profile-image.css'
       ])

<!-- Button trigger modal -->
<button type="button" class="btn btn-primary mt-1" data-bs-toggle="modal" data-bs-target="#modify_profile_image_modal_div">
    Modify Profile Photo
</button>

<!-- Modal -->
<div class="modal fade" id="modify_profile_image_modal_div" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" style="min-width:75vw;">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Modify Profile Photo</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="container">
                    <div class="row">
                        <h5>
                            Modify Your Profile Image:
                        </h5>
                    </div>
                    <div class="row">
                        <input
                            class="add-img"
                            type="file"
                            accept="image/*"
                            name="image"
                            id="add_image_input"
                        />
                        <div class="uploaded-imgs-wrapper" style="display:none;">
                            <input id="profile_image" name="profile_image" />
                        </div>
                        <div id="editor_container">
                        </div>                        
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="modal_save_button" data-user_id="{{ $user_id }}">
                    Save
                </button>
            </div>
        </div>
    </div>
</div>