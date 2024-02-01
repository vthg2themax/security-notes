const { TABS, TOOLS } = window.FilerobotImageEditor;
window.config = {
  source: document.querySelector('#current_profile_image'),
  annotationsCommon: {
    fill: '#ff0000',
  },
  Text: { text: 'Filerobot...' },
  Rotate: { angle: 90, componentType: 'buttons' },
  translations: {
    profile: 'Profile',
    coverPhoto: 'Cover photo',
    facebook: 'Facebook',
    socialMedia: 'Social Media',
    fbProfileSize: '180x180px',
    fbCoverPhotoSize: '820x312px',
  },
  Crop: {
    presetsItems: [
      {
        titleKey: 'classicTv',
        descriptionKey: '4:3',
        ratio: 4 / 3,
        // icon: CropClassicTv, // optional, CropClassicTv is a React Function component. Possible (React Function component, string or HTML Element)
      },
      {
        titleKey: 'cinemascope',
        descriptionKey: '21:9',
        ratio: 21 / 9,
        // icon: CropCinemaScope, // optional, CropCinemaScope is a React Function component.  Possible (React Function component, string or HTML Element)
      },
    ],
    presetsFolders: [
      {
        titleKey: 'socialMedia', // will be translated into Social Media as backend contains this translation key
        // icon: Social, // optional, Social is a React Function component. Possible (React Function component, string or HTML Element)
        groups: [
          {
            titleKey: 'facebook',
            items: [
              {
                titleKey: 'profile',
                width: 180,
                height: 180,
                descriptionKey: 'fbProfileSize',
              },
              {
                titleKey: 'coverPhoto',
                width: 820,
                height: 312,
                descriptionKey: 'fbCoverPhotoSize',
              },
            ],
          },
        ],
      },
    ],
  },
  tabsIds: [TABS.ADJUST, TABS.ANNOTATE, TABS.WATERMARK], // or ['Adjust', 'Annotate', 'Watermark']
  defaultTabId: TABS.ADJUST,
  defaultToolId: TOOLS.CROP,
  avoidChangesNotSavedAlertOnLeave: true,
  useCloudimage: false,
  defaultSavedImageName: 'profile_image',
  onBeforeSave: () => { return false; }
};


//Load the editor when the modal is shown
document.querySelector('#modify_profile_image_modal_div').addEventListener('shown.bs.modal', () => {
    //Reset the input value
    document.querySelector('#add_image_input').value = '';
  
    // Assuming we have a div with id="editor_container"
    window.filerobotImageEditor = new window.FilerobotImageEditor(
      document.querySelector('#editor_container'),
      window.config,
    );

    window.filerobotImageEditor.render({
      onSave: window.onSave,
    });

    document.querySelector('#add_image_input').onchange = window.uploadImg;
    document.querySelector('#modal_save_button').onclick = () => {
      var fie_save_button = document.querySelector('.FIE_topbar-save-wrapper > button');
      fie_save_button.click();
    }

  }
)
  
window.toggleActiveImage = function toggleActiveImage(imageContainer, imageSrc) {
  const removeResizeParamRegex = /\?.+/g;
  const imageUrl = imageSrc.replace(removeResizeParamRegex, '');
  const prevImageContainer = document.querySelector(
    '[data-image-editor-active-image]',
  );

  if (prevImageContainer) {
    prevImageContainer.removeAttribute('data-image-editor-active-image');
  }

  imageContainer.setAttribute('data-image-editor-active-image', '');

  window.filerobotImageEditor.render({
    source: imageUrl,
  });
}

window.appendImageToContainer = function appendImageToContainer(imageSrc, name) {
  let filename = name;
  if (!filename) {
    filename = imageSrc.split('/').pop();
  }
  const imagesWrapper = document.querySelector('.uploaded-imgs-wrapper');
  
  //Remove all the other uploaded-img elements before adding our new one
  imagesWrapper.querySelectorAll('.uploaded-img').forEach((element) => element.parentNode.removeChild(element));

  const imageWrapper = document.createElement('div');

  imageWrapper.style.backgroundImage = `url(${imageSrc})`;

  imageWrapper.className = 'uploaded-img';
  imageWrapper.dataset.name = filename;

  imageWrapper.onclick = () => window.toggleActiveImage(imageWrapper, imageSrc);

  imagesWrapper.appendChild(imageWrapper);
  imagesWrapper.scrollTop = imagesWrapper.scrollHeight;

  return imageWrapper;
}

window.uploadImg = function uploadImg(event) {
  const imageSrc = URL.createObjectURL(event.target.files[0]);

  const imageContainer = window.appendImageToContainer(
    imageSrc,
    event.target.files[0].name,
  );

  window.toggleActiveImage(imageContainer, imageSrc);

  window.filerobotImageEditor.render({ source: imageSrc });
}

window.onSave = function onSave(editedImageObject, designState) {
  const url = editedImageObject.imageBase64;
  const { fullName: fileName } = editedImageObject;  

  let tmpLink = document.createElement('a');
  tmpLink.href = url;

  tmpLink.download = fileName;

  tmpLink.style = 'position: absolute; z-index: -111; visibility: none;';
  document.body.appendChild(tmpLink);
  //tmpLink.click();
  document.body.removeChild(tmpLink);
  tmpLink = null;

  //console.log('saved', editedImageObject, designState);
  
  document.querySelector('#profile_image').value = url;
  sendData();
}

window.base64toBlob = function base64toBlob(base64url) { fetch(base64url).then((res) => res.blob()) };


async function sendData(data) {
  let csrfToken = document.head.querySelector('meta[name="csrf-token"]');

  // Construct a FormData instance
  const formData = new FormData();

  // Add a text field
  formData.append('_method', 'patch');
  //formData.append("name", "Pomegranate");
  formData.append('_token', csrfToken.content);
  //formData.append('email', 'vince@vinceworks.com');

  var userId = document.querySelector('#modal_save_button').dataset.user_id;

  // Add a file
  formData.append("profile_image", document.querySelector('#profile_image').value);

  try {
    const response = await fetch("/profile/" + userId, {
      method: "POST",
      // Set the FormData instance as the request body
      body: formData,
      credentials: "same-origin",
      headers:{
        "X-CSRF-Token": csrfToken.content,
      }
    });
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    window.location = "/profile";
  } catch (e) {
    //console.error(e);
    alert("There was an error submitting your request. Please try again.");
  }
}

