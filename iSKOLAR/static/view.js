document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // --- Form Edit/Save/Cancel Logic Elements ---
    const editBtn = document.getElementById('editBtn');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const formActions = document.getElementById('formActions');
    const profileForm = document.getElementById('profileForm');
    const inputs = profileForm.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), select, textarea');
    
    // --- Sidebar Display Elements ---
    const displayName = document.getElementById('displayName');
    const displayMajor = document.getElementById('displayMajor');
    const displayEmail = document.getElementById('displayEmail');
    const displayPhone = document.getElementById('displayPhone');
    const displayLocation = document.getElementById('displayLocation');
    const displayGraduation = document.getElementById('displayGraduation');
    
    // --- Completeness Elements ---
    const completenessBar = document.getElementById('completenessBar');
    const completenessPercent = document.getElementById('completenessPercent');
    const missingInfoList = document.querySelector('.missing-info ul');

    // --- Avatar Upload Elements ---
    const profileAvatar = document.getElementById('profileAvatar');
    const avatarInput = document.getElementById('avatarInput');
    const avatarEditIcon = document.getElementById('avatarEditIcon');

    // --- State Storage ---
    const originalValues = {};
    const radios = profileForm.querySelectorAll('input[type="radio"]');

    // Define the fields we need for completeness calculation and their properties
    const COMPLETENESS_FIELDS = [
        // Personal Info (8 items)
        { id: 'firstName', name: 'First Name' },
        { id: 'lastName', name: 'Last Name' },
        { id: 'address', name: 'Address' },
        { id: 'birthdate', name: 'Birthdate' },
        { id: 'citizenship', name: 'Citizenship' }, // Radio Group
        { id: 'gender', name: 'Gender' },           // Radio Group
        { id: 'email', name: 'Email Address' },
        { id: 'phone', name: 'Phone Number' },
        // Educational Background (4 items)
        { id: 'currentSchool', name: 'Current School' },
        { id: 'yearLevel', name: 'Year Level' },
        { id: 'course', name: 'College Course' },
        { id: 'gwa', name: 'GPA/GWA' },
        // Bio (1 item)
        { id: 'bio', name: 'Complete Bio', minLength: 20 },
    ];
    // Total fields: 13 form fields + 1 for Avatar = 14 items
    const TOTAL_FIELDS = COMPLETENESS_FIELDS.length + 1; 

    // --- Helper Functions ---

    const storeOriginalValues = () => {
        inputs.forEach(input => {
            originalValues[input.id] = input.value;
        });
        radios.forEach(radio => {
            if (radio.checked) {
                originalValues[radio.name] = radio.id;
            }
        });
        
        // Store sidebar display values for cancel
        originalValues['displayName'] = displayName.textContent;
        originalValues['displayMajor'] = displayMajor.textContent;
        originalValues['displayEmail'] = displayEmail.textContent;
        originalValues['displayPhone'] = displayPhone.textContent;
        originalValues['displayLocation'] = displayLocation.textContent;
        originalValues['displayGraduation'] = displayGraduation.textContent;

        // Store avatar state
        originalValues['avatarBackground'] = profileAvatar.style.backgroundImage;
        originalValues['avatarContent'] = profileAvatar.innerHTML;
    };

    const disableForm = (disabled) => {
        inputs.forEach(input => input.disabled = disabled);
        radios.forEach(radio => radio.disabled = disabled);
    };

    const toggleFormState = (isEditing) => {
        disableForm(!isEditing);
        formActions.style.display = isEditing ? 'flex' : 'none';
        editBtn.style.display = isEditing ? 'none' : 'flex';
    };

    // --- Dynamic Completeness Calculation ---
    const updateCompleteness = (hasAvatar) => {
        let completedCount = hasAvatar ? 1 : 0;
        let missingItems = [];
        
        // 1. Check Avatar Status
        if (!hasAvatar) {
            missingItems.push("Upload Profile Photo");
        }
        
        // 2. Check Form Fields
        COMPLETENESS_FIELDS.forEach(field => {
            let isComplete = false;
            let element = document.getElementById(field.id);

            if (element) {
                if (element.tagName === 'TEXTAREA' && field.minLength) {
                    isComplete = element.value.trim().length >= field.minLength;
                } else if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                    isComplete = element.value.trim() !== '';
                }
            } else if (field.id === 'citizenship' || field.id === 'gender') {
                // Handle Radio Groups
                const checkedRadio = document.querySelector(`input[name="${field.id}"]:checked`);
                isComplete = !!checkedRadio;
            }

            if (isComplete) {
                completedCount++;
            } else {
                let missingName = field.name;
                // Standardize missing list names for user-friendliness
                if (field.id === 'gwa') missingName = 'Add GPA/GWA';
                if (field.id === 'bio') missingName = 'Complete Bio (min 20 chars)';
                
                missingItems.push(missingName);
            }
        });

        // 3. Update Visuals
        const percentage = Math.round((completedCount / TOTAL_FIELDS) * 100);
        
        completenessBar.style.width = `${percentage}%`;
        completenessPercent.textContent = `${percentage}%`;
        
        // Update Missing Info List
        missingInfoList.innerHTML = '';
        missingItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            missingInfoList.appendChild(li);
        });
    };
    
    // Get initial avatar status and calculate initial completeness
    const initialHasAvatar = profileAvatar.style.backgroundImage !== '';
    updateCompleteness(initialHasAvatar);
    storeOriginalValues(); 

    // --- Event Listeners ---

    // 1. Avatar Upload Logic
    avatarEditIcon.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileAvatar.style.backgroundImage = `url(${e.target.result})`;
                profileAvatar.innerHTML = '';
                updateCompleteness(true); 
            };
            reader.readAsDataURL(file);
        }
    });

    // 2. Edit Button
    editBtn.addEventListener('click', () => {
        storeOriginalValues(); 
        toggleFormState(true);
    });

    // 3. Cancel Button
    cancelBtn.addEventListener('click', () => {
        // Restore form input values
        inputs.forEach(input => {
            input.value = originalValues[input.id];
        });
        radios.forEach(radio => {
            radio.checked = radio.id === originalValues[radio.name];
        });
        
        // Restore sidebar display values
        displayName.textContent = originalValues['displayName'];
        displayMajor.textContent = originalValues['displayMajor'];
        displayEmail.textContent = originalValues['displayEmail'];
        displayPhone.textContent = originalValues['displayPhone'];
        displayLocation.textContent = originalValues['displayLocation'];
        displayGraduation.textContent = originalValues['displayGraduation'];

        // Restore avatar and completeness based on original state
        profileAvatar.style.backgroundImage = originalValues['avatarBackground'];
        profileAvatar.innerHTML = originalValues['avatarContent'];
        updateCompleteness(originalValues['avatarBackground'] !== '');

        toggleFormState(false);
    });

    // 4. Save Button
    saveBtn.addEventListener('click', () => {
        // Simple validation check (must have first and last name to be displayed in sidebar)
        if (!document.getElementById('firstName').value || !document.getElementById('lastName').value) {
            alert('First Name and Last Name are required to update the profile summary.');
            return;
        }
        
        // Get graduation year from select option text (e.g., "2nd Year (2026)")
        const yearSelect = document.getElementById('yearLevel');
        const graduationYearText = yearSelect.options[yearSelect.selectedIndex].text;
        const graduationYear = graduationYearText.match(/\d{4}/)?.[0] || 'N/A';
        
        // --- Update Sidebar Display from Form Data ---
        displayName.textContent = `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`;
        displayMajor.textContent = document.getElementById('course').value || 'N/A';
        displayEmail.textContent = document.getElementById('email').value;
        displayPhone.textContent = document.getElementById('phone').value;
        displayLocation.textContent = document.getElementById('address').value;
        displayGraduation.textContent = `Class of ${graduationYear}`;
        
        // Update completeness based on new data
        updateCompleteness(profileAvatar.style.backgroundImage !== '');

        alert('Profile updated successfully!');
        
        toggleFormState(false);
        storeOriginalValues(); // Store new values as the baseline
    });

    // 5. Educational Button Visual Logic
    const eduButtons = document.querySelectorAll('.edu-btn');
    eduButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Only allow button clicks if the form is in edit mode
            if (editBtn.style.display === 'flex' || editBtn.style.display === '') { 
                return; 
            }
            eduButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

});