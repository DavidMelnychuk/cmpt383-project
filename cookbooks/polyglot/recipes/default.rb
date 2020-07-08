ubuntu_mirror = 'https://mirror.its.sfu.ca/mirror/ubuntu/'
ubuntu_release = 'bionic'
ubuntu_version = '18.04'
username = 'vagrant'
user_home = '/home/' + username
project_home = user_home + '/project/' # you may need to change the working directory to match your project

python3_packages = '/usr/local/lib/python3.6/dist-packages'
ruby_gems = '/var/lib/gems/2.5.0/gems/'

# Get Ubuntu sources set up and packages up to date.
template '/etc/apt/sources.list' do
  variables(
    :mirror => ubuntu_mirror,
    :release => ubuntu_release
  )
  notifies :run, 'execute[apt-get update]', :immediately
end

execute 'apt-get update' do
  action :nothing
end
execute 'apt-get upgrade' do
  command 'apt-get dist-upgrade -y'
  only_if 'apt list --upgradeable | grep -q upgradable'
end
directory '/opt'
directory '/opt/installers'


# Basic packages many of us probably want. Includes gcc C and C++ compilers.
package ['build-essential', 'cmake']

# Other core language tools you might want
package ['python3', 'python3-pip', 'python3-dev']  # Python
package 'golang-go'  # Go

# RabbitMQ-related things
package ['rabbitmq-server']
# Python pika library
execute 'pip3 install pika==1.1.0' do
 creates "#{python3_packages}/pika/__init__.py"
end
# Go amqp library
execute 'go get github.com/streadway/amqp github.com/google/uuid' do
 cwd project_home 
 user username
 environment 'HOME' => user_home
 creates user_home + '/go/src/github.com/streadway/amqp/README.md'
end