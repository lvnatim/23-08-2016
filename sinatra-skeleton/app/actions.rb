# Homepage (Root path)
get '/' do
  @songs = Song.all
  erb :index
end

get '/api/search' do
  content_type :json
  formatted_term = "%#{params[:search_term]}%"
  songs = Song.where('title LIKE ? OR artist LIKE ?', formatted_term, formatted_term)
  songs.to_json
end

get '/api/song' do
  content_type :json
  song = Song.find(params[:id].to_i)
  if song
    song.to_json
  else
    status 404
  end
end

put '/api/song' do
  content_type :json
  song = Song.find(params[:id].to_i)
  song.update_attributes(params[:song])
  if song.save
    songs = Song.all
    songs.to_json
  else
    status 404
  end
end

post '/api/songs' do
  song = Song.new(params[:song])
  if song.save
    song.to_json
  else
    status 404
  end
end 

delete '/api/songs' do
  song = Song.find(params[:id].to_i)
  if song
    song.destroy
  else
    status 404
  end
end
