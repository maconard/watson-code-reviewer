touch server/localdev-config.json
read -p "Please enter API key for Watson Code Reviewer: " key

echo -e "{
  'cloud_object_storage_apikey': '$key',
  'cloud_object_storage_endpoints': '',
  'cloud_object_storage_iam_apikey_description': 'description_here',
  'cloud_object_iam_apikey_name': 'key_name_here',
  'cloud_object_storage_iam_serviceid_crn': '',
  'cloud_object_storage_resource_instance_id': ''
}" > server/localdev-config.json

