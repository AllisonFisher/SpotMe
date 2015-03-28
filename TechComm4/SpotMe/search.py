from django import forms
from SpotMe.models import Area

class AreaForm(forms.Form):
	seating = forms.IntegerField(label='Seating')
	whiteboards = forms.IntegerField(label='Whiteboards')
	outlets = forms.IntegerField(label='Outlets')
	tables = forms.IntegerField(label='Tables')

	def clean_seating(self):
        if not self['seating'].html_seating in self.data:
            return self.fields['seating'].initial
        return self.cleaned_data['seating']

    def clean_whiteboards(self):
        if not self['whiteboards'].html_whiteboards in self.data:
            return self.fields['whiteboards'].initial
        return self.cleaned_data['whiteboards']

    def clean_outlets(self):
        if not self['outlets'].html_outlets in self.data:
            return self.fields['outlets'].initial
        return self.cleaned_data['outlets']

    def clean_tables(self):
        if not self['tables'].html_tables in self.data:
            return self.fields['tables'].initial
        return self.cleaned_data['tables']