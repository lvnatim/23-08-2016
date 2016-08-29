class Song < ActiveRecord::Base

  validates :title,
    presence: true
  validates :artist,
    presence: true
  validates :url,
    presence: true

end