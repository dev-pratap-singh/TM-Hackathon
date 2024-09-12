from django.contrib import admin
from .models import Turtlequery

class TurtlequeryAdmin(admin.ModelAdmin):
  list = ('title', 'description', 'completed')

admin.site.register(Turtlequery, TurtlequeryAdmin)