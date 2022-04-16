// Raw runtime functions for tab switching

function tab_switch_search() {
    document.getElementById('search_photo_section').classList.add('flex');
    document.getElementById('upload_photo_section').classList.add('hidden');
    document.getElementById('search_photo_section').classList.remove('hidden');
    document.getElementById('upload_photo_section').classList.remove('flex');
    document.getElementById('photo_search_nav').classList.add('current_tab');
    document.getElementById('search_search_nav').classList.remove('current_tab');
    document.getElementById('search_query').focus();
}

function tab_switch_upload() {
    document.getElementById('search_photo_section').classList.add('hidden');
    document.getElementById('upload_photo_section').classList.add('flex');
    document.getElementById('search_photo_section').classList.remove('flex');
    document.getElementById('upload_photo_section').classList.remove('hidden');
    document.getElementById('search_search_nav').classList.add('current_tab');
    document.getElementById('photo_search_nav').classList.remove('current_tab');
}

// Keywords Section
function keyword_section() {
    let elem = document.getElementById('nav_section').classList.toggle('section_open');
}

// jQuery for Hamburger icon
function toggle_sidebar() {
    let TOGGLE_ELEM = document.getElementById('toggle').classList.toggle('active');
    keyword_section();
    return null;
}
