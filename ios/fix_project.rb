require 'xcodeproj'

project_path = '/Users/user/Projects/mebIOS/ios/bcapp/ios/mejorenbici.xcodeproj'
file_name = 'GoogleService-Info.plist'
file_path = '/Users/user/Projects/mebIOS/ios/bcapp/ios/mejorenbici/GoogleService-Info.plist'

puts "Opening project at #{project_path}"
project = Xcodeproj::Project.open(project_path)

target = project.targets.find { |t| t.name == 'mejorenbici' }
unless target
  puts "Error: Target 'mejorenbici' not found."
  exit 1
end

group = project.main_group.find_subpath(File.join('mejorenbici'), true)
group.set_source_tree('<group>')

# Check if file reference already exists
file_ref = group.files.find { |f| f.path == file_name }
if file_ref
  puts "File reference already exists in group."
else
  puts "Adding file reference to group..."
  file_ref = group.new_reference(file_path)
end

# Check if file is in Copy Bundle Resources build phase
resources_phase = target.resources_build_phase
build_file = resources_phase.files.find { |f| f.file_ref && f.file_ref.path == file_name }

if build_file
  puts "File already in Copy Bundle Resources build phase."
else
  puts "Adding file to Copy Bundle Resources build phase..."
  resources_phase.add_file_reference(file_ref)
end

puts "Saving project..."
project.save

puts "Done."
