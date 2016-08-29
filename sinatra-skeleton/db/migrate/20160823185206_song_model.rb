class SongModel < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.string :title       
      t.string :artist
      t.string :url
    end
  end
end
