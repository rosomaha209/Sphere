from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.utils.translation import gettext_lazy as _
from users.models import CustomUser


class UserRegisterForm(UserCreationForm):
    more_info = forms.BooleanField(required=False, label=_('Provide more information'))
    email = forms.EmailField(label=_('Email Address'))
    first_name = forms.CharField(max_length=30, required=False, widget=forms.TextInput(attrs={'class': 'more-info'}),
                                 label=_('First Name'))
    last_name = forms.CharField(max_length=30, required=False, widget=forms.TextInput(attrs={'class': 'more-info'}),
                                label=_('Last Name'))
    date_of_birth = forms.DateField(required=False,
                                    widget=forms.DateInput(attrs={'class': 'more-info', 'type': 'date'}),
                                    label=_('Date of Birth'))
    phone_number = forms.CharField(max_length=20, required=False, widget=forms.TextInput(attrs={'class': 'more-info'}),
                                   label=_('Phone Number'))
    gender = forms.ChoiceField(choices=CustomUser.GENDER_CHOICES, required=False,
                               widget=forms.Select(attrs={'class': 'more-info'}), label=_('Gender'))
    city = forms.CharField(max_length=100, required=False, widget=forms.TextInput(attrs={'class': 'more-info'}),
                           label=_('City'))
    about_me = forms.CharField(required=False, widget=forms.Textarea(attrs={'class': 'more-info', 'rows': 4}),
                               label=_('About Me'))

    class Meta:
        model = CustomUser
        fields = (
            'email', 'password1', 'password2', 'more_info', 'first_name', 'last_name', 'date_of_birth', 'phone_number',
            'gender', 'city', 'about_me')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            raise forms.ValidationError(_("This email is already in use. Please choose another one."))
        return email

    def clean(self):
        cleaned_data = super().clean()
        field_one = cleaned_data.get("field_one")
        field_two = cleaned_data.get("field_two")

        if field_one != field_two:
            msg = _("Fields do not match.")
            self.add_error('field_two', msg)
            self.add_error(None, _("Please ensure your fields match."))


class UserEditForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'date_of_birth', 'phone_number', 'profile_pic', 'gender', 'city',
                  'about_me')
        widgets = {
            'date_of_birth': forms.DateInput(attrs={'type': 'date'}),
            'about_me': forms.Textarea(attrs={'rows': 4}),
        }

    def __init__(self, *args, **kwargs):
        super(UserEditForm, self).__init__(*args, **kwargs)
        self.fields['email'].disabled = True  # Якщо ви не хочете, щоб email був змінений
