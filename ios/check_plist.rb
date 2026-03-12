require 'xcodeproj'
project_path = '/Users/user/Projects/mebIOS/ios/bcapp/ios/mejorenbici.xcodeproj'
project = Xcodeproj::Project.open(project_path)
target = project.targets.find { |t| t.name == 'mejorenbici' }
if target
  puts "Target found: #{target.name}"
  
  # Check main group or resources
  file_in_group = project.main_group.recursive_children.find { |c| c.name == 'GoogleService-Info.plist' || c.path == 'GoogleService-Info.plist' }
  puts "File in Group: #{file_in_group ? 'Yes' : 'No'}"

  # Check Build Phases
  resources_phase = target.resources_build_phase
  file_in_phase = resources_phase.files.find { |f| f.file_ref && (f.file_ref.name == 'GoogleService-Info.plist' || f.file_ref.path == 'GoogleService-Info.plist') }
  puts "File in Resources Build Phase: #{file_in_phase ? 'Yes' : 'No'}"
else
  puts "Target 'mejorenbici' not found"
end
