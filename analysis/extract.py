from goose import Goose
import sys

def extract(url, language = None):
    if language:
        print language
        g = Goose({'use_meta_language': False, 'target_language': language})
    else:
        g = Goose()

    return g.extract(url=url)


def main():
    if len(sys.argv) < 2 or sys.argv[1] == "--help" :
        print "Usage :"
        print "extract <url> : extract content from an url and prints it"
        print "extract <url> <language> : extract content from an url using language tag and prints it"
        print "extract --help : prints this message"
        return 0
    language = None
    if len(sys.argv) > 2:
        language = sys.argv[2]
    url = sys.argv[1]
    print extract(url, language).cleaned_text
    return 0

if __name__ == "__main__":
    sys.exit(main())
