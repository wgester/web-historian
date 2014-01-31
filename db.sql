CREATE TABLE `urls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` text NOT NULL,
  `archived` boolean NOT NULL DEFAULT FALSE,
  `body0` text NOT NULL,
  `body1` text,
  `body2` text,
  `body3` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;